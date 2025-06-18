import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatGateway } from '../socket/chat.gateway';
import { MessageDirection } from './dto/load-messages.args';

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
    const chat = await this.prisma.chat.findFirst({
      where: { id: input.chatId, participants: { some: { username: user } } },
    });
    if (!chat) {
      throw new BadRequestException('Chat not found');
    }

    const message = await this.prisma.message.create({
      data: {
        chat: { connect: { id: input.chatId } },
        sender: { connect: { username: user } },
        text: input.text,
      },
      include: { sender: true },
    });
    this.gateway.newMessage(message);
    return message;
  }

  loadMessages(args: {
    chatId: string;
    cursor?: string;
    direction?: MessageDirection;
  }): Promise<Message[]> {
    const take = 20;
    const order = args.direction ?? MessageDirection.DESC;

    return this.prisma.message.findMany({
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
