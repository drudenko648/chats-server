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

  @Field(() => ID, {
    nullable: true,
    description: 'Id of the message that will be used as cursor for pagination',
  })
  @IsOptional()
  cursor?: string;

  @Field(() => MessageDirection, {
    nullable: true,
    description: 'Message loading direction. ASC newer, DESC older',
  })
  @IsOptional()
  direction?: MessageDirection;
}
