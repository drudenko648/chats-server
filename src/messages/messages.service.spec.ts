import { Test } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChatGateway } from '../socket/chat.gateway';
import { BadRequestException } from '@nestjs/common';

describe('MessagesService', () => {
  let service: MessagesService;
  let prisma: PrismaService;
  const gateway = { newMessage: jest.fn() } as unknown as ChatGateway;

  beforeEach(async () => {
    const findFirst = jest.fn();
    const create = jest.fn();
    const upsert = jest.fn();
    prisma = {
      chat: { findFirst },
      message: { create },
      seenChat: { upsert },
    } as unknown as PrismaService;

    const module = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: PrismaService, useValue: prisma },
        { provide: ChatGateway, useValue: gateway },
      ],
    }).compile();

    service = module.get(MessagesService);
  });

  it('sendMessage sends when chat exists', async () => {
    (prisma.chat.findFirst as jest.Mock).mockResolvedValue({ id: '1' });

    (prisma.message.create as jest.Mock).mockResolvedValue({
      id: 'm1',
      chatId: '1',
    });
    await expect(
      service.sendMessage({ chatId: '1', text: 'hi' }, 'alice'),
    ).resolves.toEqual({ id: 'm1', chatId: '1' });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(gateway.newMessage).toHaveBeenCalled();
  });

  it('sendMessage throws when chat missing', async () => {
    (prisma.chat.findFirst as jest.Mock).mockResolvedValue(null);
    await expect(
      service.sendMessage({ chatId: '2', text: 'hi' }, 'alice'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
