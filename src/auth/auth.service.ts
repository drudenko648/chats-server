import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpInput } from './dto/sign-up.input';
import { SignInInput } from './dto/sign-in.input';
import { AuthPayload } from './dto/auth-payload.object';

/* eslint-disable @typescript-eslint/no-unsafe-call,
  @typescript-eslint/no-unsafe-member-access,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-argument */

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signUp(data: SignUpInput): Promise<AuthPayload> {
    const hashed = await argon2.hash(data.password, { type: argon2.argon2id });
    const user = await this.prisma.user.create({
      data: { username: data.username, password: hashed },
    });
    return { token: this.issueToken(user.id, user.username) };
  }

  async signIn(data: SignInInput): Promise<AuthPayload> {
    const user = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (!user) throw new Error('Invalid credentials');
    const valid = await argon2.verify(user.password, data.password);
    if (!valid) throw new Error('Invalid credentials');
    return { token: this.issueToken(user.id, user.username) };
  }

  private issueToken(userId: string, username: string): string {
    return this.jwt.sign({ sub: userId, username });
  }
}
