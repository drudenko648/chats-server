import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Prisma } from '@prisma/client';
import { EventPatternsWs } from './event-patterns-ws.constants';
import { JoinChatDto } from './dto/join-chat.dto';
import { AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';
import { LeaveChatDto } from './dto/leave-chat.dto';
import { Message } from 'src/messages/dto/message.object';
import { ChatSummary } from '../chats/dto/chat-summary.object';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage(EventPatternsWs.joinChat)
  @AsyncApiPub({
    channel: EventPatternsWs.joinChat,
    message: {
      payload: JoinChatDto,
    },
  })
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinChatDto,
  ): Promise<void> {
    console.log(payload);
    await client.join(payload.chatId);
  }

  @SubscribeMessage(EventPatternsWs.leaveChat)
  @AsyncApiPub({
    channel: EventPatternsWs.leaveChat,
    message: {
      payload: LeaveChatDto,
    },
  })
  async handleLeaveChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinChatDto,
  ): Promise<void> {
    console.log(payload);
    await client.leave(payload.chatId);
  }

  @AsyncApiSub({
    channel: EventPatternsWs.newMessage,
    message: {
      payload: Message,
    },
  })
  newMessage(message: Message): void {
    this.server.to(message.chatId).emit(EventPatternsWs.newMessage, message);
  }

  @AsyncApiSub({
    channel: EventPatternsWs.newChat,
    message: {
      payload: ChatSummary,
    },
  })
  chatCreated(
    chat: Prisma.ChatGetPayload<{
      include: { participants: { select: { username: true } } };
    }>,
    username: string,
  ): void {
    for (const user of chat.participants) {
      if (user.username !== username) {
        this.server.to(user.username).emit(EventPatternsWs.newChat, chat);
      }
    }
  }

  messageRead(chatId: string, username: string, seenAt: Date): void {
    this.server.to(chatId).emit('messageRead', { chatId, username, seenAt });
  }
}
