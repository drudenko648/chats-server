import { Field, InputType } from '@nestjs/graphql';
import { IsAlphanumeric, IsString } from 'class-validator';

@InputType()
export class SignInInput {
  @Field()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsAlphanumeric()
  username!: string;

  @Field()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  password!: string;
}
