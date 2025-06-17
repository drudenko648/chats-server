import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('argon2');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  const jwt = {
    signAsync: jest.fn().mockResolvedValue('token'),
  } as unknown as JwtService;

  beforeEach(async () => {
    prisma = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    } as unknown as PrismaService;

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('signUp should store hashed password and return token', async () => {
    (argon2.hash as jest.Mock).mockResolvedValue('hashed');
    await expect(
      service.signUp({ username: 'a', password: 'b' }),
    ).resolves.toEqual({ accessToken: 'token' });
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { username: 'a', password: 'hashed' },
    });
  });

  it('signIn should return token with valid credentials', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      username: 'a',
      password: 'hashed',
    });
    (argon2.verify as jest.Mock).mockResolvedValue(true);
    await expect(
      service.signIn({ username: 'a', password: 'b' }),
    ).resolves.toEqual({ accessToken: 'token' });
  });

  it('signIn should throw with invalid credentials', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      username: 'a',
      password: 'hashed',
    });
    (argon2.verify as jest.Mock).mockResolvedValue(false);
    await expect(
      service.signIn({ username: 'a', password: 'b' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
