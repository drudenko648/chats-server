import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSummary } from './dto/user-summary.object';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { GqlJwtAuthGuard } from '../common/guards/gql-jwt-auth.guard';

@Resolver()
export class UsersResolver {
  constructor(private users: UsersService) {}

  @Query(() => [UserSummary])
  @UseGuards(GqlJwtAuthGuard)
  searchUsers(
    @Args('username') username: string,
    @CurrentUser() user: { username: string },
  ) {
    return this.users.searchUsers(username, user.username);
  }
}
