import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Search users by username, excluding the current user.
   */
  async searchUsers(username: string, current: string): Promise<User[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    return await this.prisma.user.findMany({
      where: {
        username: { contains: username, mode: 'insensitive' },
        NOT: { username: current },
      },
      take: 10,
    });
  }
}
