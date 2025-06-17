import { ArgsType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

export enum MessageDirection {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(MessageDirection, { name: 'MessageDirection' });

@ArgsType()
export class LoadMessagesArgs {
  @Field(() => ID)
  chatId!: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  cursor?: string;

  @Field(() => MessageDirection, { nullable: true })
  @IsOptional()
  direction?: MessageDirection;
}
