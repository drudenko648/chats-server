import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { AuthPayload } from './dto/auth.payload';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  /**
   * Register a new user and return an access token.
   */
  async signUp(input: SignUpInput): Promise<AuthPayload> {
    const hashed = await argon2.hash(input.password, { type: argon2.argon2id });

    await this.prisma.user.create({
      data: { username: input.username, password: hashed },
    });
    return this.signToken(input.username);
  }

  /**
   * Authenticate a user and return an access token.
   */
  async signIn(input: SignInInput): Promise<AuthPayload> {
    const user = await this.prisma.user.findUnique({
      where: { username: input.username },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await argon2.verify(user.password, input.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user.username);
  }

  private async signToken(username: string): Promise<AuthPayload> {
    const accessToken = await this.jwt.signAsync({ username });
    return { accessToken };
  }
}
