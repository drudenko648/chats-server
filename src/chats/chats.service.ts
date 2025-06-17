import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatGateway } from '../socket/chat.gateway';
import { Chat } from '@prisma/client';

@Injectable()
export class ChatsService {
  constructor(
    private prisma: PrismaService,
    private gateway: ChatGateway,
  ) {}

  async createChat(username: string, currentUser: string): Promise<Chat> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const other = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!other) {
      throw new BadRequestException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const existing = await this.prisma.chat.findFirst({
      where: {
        participants: {
          some: { username: currentUser },
        },
        AND: {
          participants: {
            some: { username },
          },
        },
      },
      include: { participants: true },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (existing && existing.participants.length === 2) {
      throw new BadRequestException('Chat already exists');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const chat = await this.prisma.chat.create({
      data: {
        participants: {
          connect: [{ username: currentUser }, { username: username }],
        },
      },
      include: { participants: true },
    });
    this.gateway.chatCreated(chat, username);
    return chat;
  }

  async getChats(currentUser: string): Promise<Chat[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    return await this.prisma.chat.findMany({
      where: {
        participants: { some: { username: currentUser } },
      },
      include: { participants: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
