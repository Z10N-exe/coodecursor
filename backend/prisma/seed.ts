import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Create admin user
    const adminEmail = 'admin@aspiresecuretrade.com';
    const adminPass = await bcrypt.hash('AdminStrong!2025', 12);
    
    const admin = await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        name: 'Super Admin',
        email: adminEmail,
        role: 'SuperAdmin',
        passwordHash: adminPass,
        twoFaEnabled: false,
        isActive: true,
      },
    });

    console.log('✅ Admin user created:', admin.email);

    // Create demo user
    const userEmail = 'demo@aspiresecuretrade.com';
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
        isFrozen: false,
      },
    });

    console.log('✅ Demo user created:', user.email);

    // Create user balance
    await prisma.balance.upsert({
      where: { userId_currency: { userId: user.id, currency: 'USD' } },
      update: { available: new Prisma.Decimal('1500.00') },
      create: { 
        userId: user.id, 
        currency: 'USD', 
        available: new Prisma.Decimal('1500.00'), 
        trading: new Prisma.Decimal('0'), 
        locked: new Prisma.Decimal('0') 
      },
    });

    console.log('✅ User balance created');

    // Create sample transactions
    await prisma.transaction.createMany({
      data: [
        {
          userId: user.id,
          type: 'deposit',
          amount: new Prisma.Decimal('1000.00'),
          currency: 'USD',
          status: 'completed',
          reference: 'DEP-001',
          metadata: { method: 'bank_transfer', description: 'Initial deposit' },
        },
        {
          userId: user.id,
          type: 'profit',
          amount: new Prisma.Decimal('500.00'),
          currency: 'USD',
          status: 'completed',
          reference: 'PROF-001',
          metadata: { description: 'Trading profit', period: 'Q1 2024' },
        },
      ],
    });

    console.log('✅ Sample transactions created');

    // Create sample withdrawal request
    await prisma.withdrawalRequest.create({
      data: {
        userId: user.id,
        amount: new Prisma.Decimal('200.00'),
        currency: 'USD',
        method: 'bank_transfer',
        details: { accountNumber: '1234567890', bankName: 'Demo Bank' },
        status: 'requested',
      },
    });

    console.log('✅ Sample withdrawal request created');

    console.log('🎉 Seed complete successfully!');
    console.log('📧 Admin:', adminEmail, '(Password: AdminStrong!2025)');
    console.log('👤 User:', userEmail, '(Password: UserStrong!2025)');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
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
