import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageInput } from './dto/send-message.input';
import { Message } from './dto/message.object';
import { LoadMessagesArgs } from './dto/load-messages.args';
import { GqlJwtAuthGuard } from '../common/guards/gql-jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MarkReadInput } from './dto/mark-read.input';

@Resolver()
export class MessagesResolver {
  constructor(private messages: MessagesService) {}

  @Mutation(() => Message)
  @UseGuards(GqlJwtAuthGuard)
  sendMessage(
    @Args('input') input: SendMessageInput,
    @CurrentUser() user: { username: string },
  ) {
    return this.messages.sendMessage(input, user.username);
  }

  @Query(() => [Message])
  @UseGuards(GqlJwtAuthGuard)
  loadMessages(@Args() args: LoadMessagesArgs) {
    return this.messages.loadMessages(args);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlJwtAuthGuard)
  markChatRead(
    @Args('input') input: MarkReadInput,
    @CurrentUser() user: { username: string },
  ) {
    return this.messages.markChatRead(
      input.chatId,
      user.username,
      input.seenAt,
    );
  }
}
