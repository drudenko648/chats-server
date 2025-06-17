import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserSummary {
  @Field()
  username!: string;
}
