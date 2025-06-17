import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { username: 'alice', password: 'password1' },
    { username: 'bob', password: 'password2' },
  ];
  for (const u of users) {
    const hashed = await argon2.hash(u.password, { type: argon2.argon2id });
    await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: {
        username: u.username,
        password: hashed,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
