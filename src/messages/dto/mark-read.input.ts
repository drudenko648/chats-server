import { Field, InputType, ID } from '@nestjs/graphql';
import { IsISO8601 } from 'class-validator';

@InputType()
export class MarkReadInput {
  @Field(() => ID)
  chatId!: string;

  @Field({
    description: 'ISO8601 date string',
  })
  @IsISO8601()
  seenAt!: Date;
}
