import { Field, InputType } from '@nestjs/graphql';
import { IsAlphanumeric, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateChatInput {
  @Field()
  @IsAlphanumeric()
  @IsNotEmpty()
  username!: string;
}
