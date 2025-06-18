import { Field, InputType, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class SendMessageInput {
  @Field(() => ID)
  @IsNotEmpty()
  chatId!: string;

  @Field()
  @IsNotEmpty()
  text!: string;
}
