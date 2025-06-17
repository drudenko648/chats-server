/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Field, InputType } from '@nestjs/graphql';
import { IsAlphanumeric, IsNotEmpty } from 'class-validator';

@InputType()
export class SignInInput {
  @Field()
  @IsAlphanumeric()
  @IsNotEmpty()
  username!: string;

  @Field()
  @IsNotEmpty()
  password!: string;
}
