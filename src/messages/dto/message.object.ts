import { Field, ObjectType, ID } from '@nestjs/graphql';
import { UserSummary } from '../../users/dto/user-summary.object';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class Message {
  @Field(() => ID)
  @ApiProperty()
  id!: string;

  @Field()
  @ApiProperty()
  chatId!: string;

  @Field(() => UserSummary)
  @ApiProperty()
  sender!: UserSummary;

  @Field()
  @ApiProperty()
  text!: string;

  @Field()
  @ApiProperty()
  createdAt!: Date;
}
