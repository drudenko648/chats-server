import { Field, ObjectType } from '@nestjs/graphql';
import { UserSummary } from '../../users/dto/user-summary.object';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class ChatSummary {
  @Field()
  @ApiProperty()
  id!: string;

  @Field(() => String, { nullable: true })
  @ApiProperty()
  title: string | null;

  @Field()
  @ApiProperty()
  createdAt!: Date;

  @Field(() => [UserSummary])
  @ApiProperty()
  participants!: UserSummary[];
}
