import { Field, InputType } from '@nestjs/graphql';
import { IsAlphanumeric, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateChatInput {
  @Field({
    description: 'Should be non-empty alphanumeric string',
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  username!: string;
}
