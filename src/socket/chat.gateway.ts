import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Message {
  chatId: string;
}

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @MessageBody() chatId: string,
    client: Socket,
  ): Promise<void> {
    await client.join(chatId);
  }

  @SubscribeMessage('leaveChat')
  async handleLeaveChat(
    @MessageBody() chatId: string,
    client: Socket,
  ): Promise<void> {
    await client.leave(chatId);
  }

  newMessage(message: Message): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    this.server.to(message.chatId).emit('newMessage', message);
  }

  chatCreated(chat: any, username: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    for (const user of chat.participants) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (user.username !== username) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
        this.server.to(user.username).emit('chatCreated', chat);
      }
    }
  }

  messageRead(chatId: string, username: string, seenAt: Date): void {
    this.server.to(chatId).emit('messageRead', { chatId, username, seenAt });
  }
}
