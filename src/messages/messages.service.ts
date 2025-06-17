import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatGateway } from '../socket/chat.gateway';
import { MessageDirection } from './dto/load-messages.args';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Message {}

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private gateway: ChatGateway,
  ) {}

  async sendMessage(
    input: { chatId: string; text: string },
    user: string,
  ): Promise<Message> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const chat = await this.prisma.chat.findFirst({
      where: { id: input.chatId, participants: { some: { username: user } } },
    });
    if (!chat) {
      throw new BadRequestException('Chat not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const message = await this.prisma.message.create({
      data: {
        chatId: input.chatId,
        sender: { connect: { username: user } },
        text: input.text,
      },
      include: { sender: true },
    });
    this.gateway.newMessage(message);
    return message;
  }

  async loadMessages(args: {
    chatId: string;
    cursor?: string;
    direction?: MessageDirection;
  }): Promise<Message[]> {
    const take = 20;
    const order = args.direction ?? MessageDirection.DESC;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    return await this.prisma.message.findMany({
      where: { chatId: args.chatId },
      include: { sender: true },
      orderBy: { createdAt: order },
      take,
      ...(args.cursor && {
        cursor: { id: args.cursor },
        skip: 1,
      }),
    });
  }

  async markChatRead(
    chatId: string,
    user: string,
    seenAt: Date,
  ): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await this.prisma.seenChat.upsert({
      where: {
        userId_chatId: { userId: user, chatId },
      },
      update: { seenAt },
      create: {
        user: { connect: { username: user } },
        chat: { connect: { id: chatId } },
        seenAt,
      },
    });
    this.gateway.messageRead(chatId, user, seenAt);
    return true;
  }
}
