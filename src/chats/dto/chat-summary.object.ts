import { Field, ObjectType } from '@nestjs/graphql';
import { UserSummary } from '../../users/dto/user-summary.object';

@ObjectType()
export class ChatSummary {
  @Field()
  id!: string;

  @Field({ nullable: true })
  title?: string | null;

  @Field()
  createdAt!: Date;

  @Field(() => [UserSummary])
  participants!: UserSummary[];
}
