import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatInput } from './dto/create-chat.input';
import { ChatSummary } from './dto/chat-summary.object';
import { GqlJwtAuthGuard } from '../common/guards/gql-jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver()
export class ChatsResolver {
  constructor(private chats: ChatsService) {}

  @Mutation(() => ChatSummary)
  @UseGuards(GqlJwtAuthGuard)
  createChat(
    @Args('input') input: CreateChatInput,
    @CurrentUser() user: { username: string },
  ) {
    return this.chats.createChat(input.username, user.username);
  }

  @Query(() => [ChatSummary])
  @UseGuards(GqlJwtAuthGuard)
  getChats(@CurrentUser() user: { username: string }) {
    return this.chats.getChats(user.username);
  }
}
