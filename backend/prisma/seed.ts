import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@aspire.local';
  const adminPass = await bcrypt.hash('AdminStrong!2025', 12);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Super Admin',
      email: adminEmail,
      role: 'SuperAdmin',
      passwordHash: adminPass,
      twoFaEnabled: false,
    },
  });

  const userEmail = 'demo@aspire.local';
  const userPass = await bcrypt.hash('UserStrong!2025', 12);
  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      firstName: 'Demo',
      lastName: 'User',
      email: userEmail,
      phoneE164: '+15555550100',
      countryCode: 'US',
      passwordHash: userPass,
      isAdult: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      kycStatus: 'passed',
    },
  });

  await prisma.balance.upsert({
    where: { userId_currency: { userId: user.id, currency: 'USD' } },
    update: { available: new Prisma.Decimal('1500.00') },
    create: { userId: user.id, currency: 'USD', available: new Prisma.Decimal('1500.00'), trading: new Prisma.Decimal('0'), locked: new Prisma.Decimal('0') },
  });

  console.log('Seed complete. Admin:', adminEmail, 'User:', userEmail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
