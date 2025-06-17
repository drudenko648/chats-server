import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [PrismaModule, SocketModule],
  providers: [ChatsService, ChatsResolver],
  exports: [ChatsService],
})
export class ChatsModule {}
