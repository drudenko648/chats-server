import { Field, InputType } from '@nestjs/graphql';
import { IsAlphanumeric, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field({
    description: 'Should be non-empty alphanumeric string',
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  username!: string;

  @Field({
    description: 'Should be string longer than 6 characters',
  })
  @MinLength(6)
  password!: string;
}
