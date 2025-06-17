import { Field, ObjectType, ID } from '@nestjs/graphql';
import { UserSummary } from '../../users/dto/user-summary.object';

@ObjectType()
export class Message {
  @Field(() => ID)
  id!: string;

  @Field()
  chatId!: string;

  @Field(() => UserSummary)
  sender!: UserSummary;

  @Field()
  text!: string;

  @Field()
  createdAt!: Date;
}
