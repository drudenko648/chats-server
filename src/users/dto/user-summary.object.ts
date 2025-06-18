import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class UserSummary {
  @Field()
  @ApiProperty()
  username!: string;
}
