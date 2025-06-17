/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Field, InputType } from '@nestjs/graphql';
import { IsAlphanumeric, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field()
  @IsAlphanumeric()
  @IsNotEmpty()
  username!: string;

  @Field()
  @MinLength(6)
  password!: string;
}
