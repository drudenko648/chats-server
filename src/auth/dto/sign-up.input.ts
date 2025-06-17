import { Field, InputType } from '@nestjs/graphql';
import { IsAlphanumeric, IsString, MinLength } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsAlphanumeric()
  username!: string;

  @Field()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @MinLength(6)
  password!: string;
}
