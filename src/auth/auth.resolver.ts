import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/sign-up.input';
import { SignInInput } from './dto/sign-in.input';
import { AuthPayload } from './dto/auth.payload';

@Resolver()
export class AuthResolver {
  constructor(private auth: AuthService) {}

  @Mutation(() => AuthPayload)
  signUp(@Args('input') input: SignUpInput): Promise<AuthPayload> {
    return this.auth.signUp(input);
  }

  @Mutation(() => AuthPayload)
  signIn(@Args('input') input: SignInInput): Promise<AuthPayload> {
    return this.auth.signIn(input);
  }
}
