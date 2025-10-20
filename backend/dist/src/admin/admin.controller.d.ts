import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
declare class AdjustBalanceDto {
    amount: string;
    currency: string;
    type: 'credit' | 'debit';
    reason: string;
}
declare class ApproveWithdrawalDto {
    adminId: string;
    note: string;
}
export declare class AdminController {
    private prisma;
    constructor(prisma: PrismaService);
    getUsers(search?: string, page?: string, limit?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', status?: string): Promise<{
        users: {
            id: string;
            email: string | null;
            createdAt: Date;
            phoneE164: string | null;
            firstName: string;
            lastName: string;
            countryCode: string;
            kycStatus: string;
            isFrozen: boolean;
            balances: {
                currency: string;
                available: Prisma.Decimal;
                trading: Prisma.Decimal;
                locked: Prisma.Decimal;
            }[];
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getUser(id: string): Promise<{
        balances: {
            id: string;
            userId: string;
            currency: string;
            available: Prisma.Decimal;
            trading: Prisma.Decimal;
            locked: Prisma.Decimal;
        }[];
        transactions: {
            id: string;
            createdAt: Date;
            userId: string;
            currency: string;
            amount: Prisma.Decimal;
            status: string;
            type: string;
            reference: string | null;
            createdByAdminId: string | null;
            metadata: Prisma.JsonValue;
        }[];
        withdrawals: {
            id: string;
            createdAt: Date;
            userId: string;
            currency: string;
            method: string;
            amount: Prisma.Decimal;
            details: Prisma.JsonValue;
            status: string;
            adminId: string | null;
            adminNote: string | null;
            processedAt: Date | null;
        }[];
    } & {
        id: string;
        email: string | null;
        passwordHash: string;
        createdAt: Date;
        phoneE164: string | null;
        firstName: string;
        lastName: string;
        countryCode: string;
        isEmailVerified: boolean;
        isPhoneVerified: boolean;
        isAdult: boolean;
        kycStatus: string;
        isFrozen: boolean;
        updatedAt: Date;
    }>;
    freezeAccount(userId: string, body: {
        reason: string;
    }, req: any): Promise<{
        id: string;
        email: string | null;
        passwordHash: string;
        createdAt: Date;
        phoneE164: string | null;
        firstName: string;
        lastName: string;
        countryCode: string;
        isEmailVerified: boolean;
        isPhoneVerified: boolean;
        isAdult: boolean;
        kycStatus: string;
        isFrozen: boolean;
        updatedAt: Date;
    }>;
    unfreezeAccount(userId: string, body: {
        reason: string;
    }, req: any): Promise<{
        id: string;
        email: string | null;
        passwordHash: string;
        createdAt: Date;
        phoneE164: string | null;
        firstName: string;
        lastName: string;
        countryCode: string;
        isEmailVerified: boolean;
        isPhoneVerified: boolean;
        isAdult: boolean;
        kycStatus: string;
        isFrozen: boolean;
        updatedAt: Date;
    }>;
    resetPassword(userId: string, body: {
        newPassword: string;
        reason: string;
    }, req: any): Promise<{
        message: string;
    }>;
    impersonateUser(userId: string, body: {
        reason: string;
    }, req: any): Promise<{
        impersonationToken: string;
        message: string;
        userId: string;
    }>;
    adjustBalance(userId: string, dto: AdjustBalanceDto, req: any): Promise<{
        balance: {
            id: string;
            userId: string;
            currency: string;
            available: Prisma.Decimal;
            trading: Prisma.Decimal;
            locked: Prisma.Decimal;
        };
        transaction: {
            id: string;
            createdAt: Date;
            userId: string;
            currency: string;
            amount: Prisma.Decimal;
            status: string;
            type: string;
            reference: string | null;
            createdByAdminId: string | null;
            metadata: Prisma.JsonValue;
        };
    }>;
    getWithdrawals(status?: string, page?: string, limit?: string): Promise<{
        withdrawals: ({
            user: {
                id: string;
                email: string | null;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            currency: string;
            method: string;
            amount: Prisma.Decimal;
            details: Prisma.JsonValue;
            status: string;
            adminId: string | null;
            adminNote: string | null;
            processedAt: Date | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    approveWithdrawal(withdrawalId: string, dto: ApproveWithdrawalDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        currency: string;
        method: string;
        amount: Prisma.Decimal;
        details: Prisma.JsonValue;
        status: string;
        adminId: string | null;
        adminNote: string | null;
        processedAt: Date | null;
    }>;
    rejectWithdrawal(withdrawalId: string, dto: ApproveWithdrawalDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        currency: string;
        method: string;
        amount: Prisma.Decimal;
        details: Prisma.JsonValue;
        status: string;
        adminId: string | null;
        adminNote: string | null;
        processedAt: Date | null;
    }>;
    getAuditLog(page?: string, limit?: string): Promise<{
        logs: {
            id: string;
            createdAt: Date;
            adminId: string;
            metadata: Prisma.JsonValue;
            reason: string;
            actionType: string;
            targetType: string;
            targetId: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
}
export {};
