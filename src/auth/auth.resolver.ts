import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/sign-up.input';
import { SignInInput } from './dto/sign-in.input';
import { AuthPayload } from './dto/auth-payload.object';

@Resolver()
export class AuthResolver {
  constructor(private auth: AuthService) {}

  @Mutation(() => AuthPayload)
  signUp(@Args('data') data: SignUpInput): Promise<AuthPayload> {
    return this.auth.signUp(data);
  }

  @Mutation(() => AuthPayload)
  signIn(@Args('data') data: SignInInput): Promise<AuthPayload> {
    return this.auth.signIn(data);
  }
}
