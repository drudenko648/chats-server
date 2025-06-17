import { Field, InputType, ID } from '@nestjs/graphql';
import { IsISO8601 } from 'class-validator';

@InputType()
export class MarkReadInput {
  @Field(() => ID)
  chatId!: string;

  @Field()
  @IsISO8601()
  seenAt!: Date;
}
