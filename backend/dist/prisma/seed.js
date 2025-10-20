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
        update: { available: new client_1.Prisma.Decimal('1500.00') },
        create: { userId: user.id, currency: 'USD', available: new client_1.Prisma.Decimal('1500.00'), trading: new client_1.Prisma.Decimal('0'), locked: new client_1.Prisma.Decimal('0') },
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
//# sourceMappingURL=seed.js.map