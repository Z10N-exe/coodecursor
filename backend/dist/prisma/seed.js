"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seed...');
    try {
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
        await prisma.balance.upsert({
            where: { userId_currency: { userId: user.id, currency: 'USD' } },
            update: { available: new client_1.Prisma.Decimal('1500.00') },
            create: {
                userId: user.id,
                currency: 'USD',
                available: new client_1.Prisma.Decimal('1500.00'),
                trading: new client_1.Prisma.Decimal('0'),
                locked: new client_1.Prisma.Decimal('0')
            },
        });
        console.log('✅ User balance created');
        await prisma.transaction.createMany({
            data: [
                {
                    userId: user.id,
                    type: 'deposit',
                    amount: new client_1.Prisma.Decimal('1000.00'),
                    currency: 'USD',
                    status: 'completed',
                    reference: 'DEP-001',
                    metadata: { method: 'bank_transfer', description: 'Initial deposit' },
                },
                {
                    userId: user.id,
                    type: 'profit',
                    amount: new client_1.Prisma.Decimal('500.00'),
                    currency: 'USD',
                    status: 'completed',
                    reference: 'PROF-001',
                    metadata: { description: 'Trading profit', period: 'Q1 2024' },
                },
            ],
        });
        console.log('✅ Sample transactions created');
        await prisma.withdrawalRequest.create({
            data: {
                userId: user.id,
                amount: new client_1.Prisma.Decimal('200.00'),
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
    }
    catch (error) {
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
//# sourceMappingURL=seed.js.map