"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
class AdjustBalanceDto {
    amount;
    currency;
    type;
    reason;
}
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], AdjustBalanceDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdjustBalanceDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['credit', 'debit']),
    __metadata("design:type", String)
], AdjustBalanceDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdjustBalanceDto.prototype, "reason", void 0);
class ApproveWithdrawalDto {
    adminId;
    note;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApproveWithdrawalDto.prototype, "adminId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApproveWithdrawalDto.prototype, "note", void 0);
let AdminController = class AdminController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUsers(search, page, limit, sortBy, sortOrder, status) {
        const pageNum = parseInt(page || '1');
        const limitNum = parseInt(limit || '20');
        const skip = (pageNum - 1) * limitNum;
        let where = {};
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phoneE164: { contains: search } },
            ];
        }
        if (status) {
            if (status === 'frozen') {
                where.isFrozen = true;
            }
            else if (status === 'active') {
                where.isFrozen = false;
            }
            else if (status === 'kyc_pending') {
                where.kycStatus = 'pending';
            }
            else if (status === 'kyc_approved') {
                where.kycStatus = 'passed';
            }
        }
        const orderBy = {};
        if (sortBy) {
            orderBy[sortBy] = sortOrder || 'desc';
        }
        else {
            orderBy.createdAt = 'desc';
        }
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limitNum,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phoneE164: true,
                    countryCode: true,
                    kycStatus: true,
                    isFrozen: true,
                    createdAt: true,
                    balances: {
                        select: {
                            currency: true,
                            available: true,
                            trading: true,
                            locked: true,
                        },
                    },
                },
                orderBy,
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            users,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        };
    }
    async getUser(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                balances: true,
                transactions: {
                    take: 50,
                    orderBy: { createdAt: 'desc' },
                },
                withdrawals: {
                    take: 20,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async freezeAccount(userId, body, req) {
        const adminId = req.user.userId;
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { id: userId },
                data: { isFrozen: true },
            });
            await tx.adminAuditLog.create({
                data: {
                    adminId,
                    actionType: 'freeze_account',
                    targetType: 'user',
                    targetId: userId,
                    reason: body.reason,
                    metadata: { userId, action: 'freeze' },
                },
            });
            return user;
        });
    }
    async unfreezeAccount(userId, body, req) {
        const adminId = req.user.userId;
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { id: userId },
                data: { isFrozen: false },
            });
            await tx.adminAuditLog.create({
                data: {
                    adminId,
                    actionType: 'unfreeze_account',
                    targetType: 'user',
                    targetId: userId,
                    reason: body.reason,
                    metadata: { userId, action: 'unfreeze' },
                },
            });
            return user;
        });
    }
    async resetPassword(userId, body, req) {
        const adminId = req.user.userId;
        const bcrypt = require('bcrypt');
        return this.prisma.$transaction(async (tx) => {
            const passwordHash = await bcrypt.hash(body.newPassword, 12);
            await tx.user.update({
                where: { id: userId },
                data: { passwordHash },
            });
            await tx.adminAuditLog.create({
                data: {
                    adminId,
                    actionType: 'reset_password',
                    targetType: 'user',
                    targetId: userId,
                    reason: body.reason,
                    metadata: { userId, action: 'password_reset' },
                },
            });
            return { message: 'Password reset successfully' };
        });
    }
    async impersonateUser(userId, body, req) {
        const adminId = req.user.userId;
        await this.prisma.adminAuditLog.create({
            data: {
                adminId,
                actionType: 'impersonate_user',
                targetType: 'user',
                targetId: userId,
                reason: body.reason,
                metadata: {
                    userId,
                    adminId,
                    action: 'impersonate',
                    timestamp: new Date().toISOString()
                },
            },
        });
        const impersonationToken = `impersonate_${userId}_${Date.now()}`;
        return {
            impersonationToken,
            message: 'Impersonation token generated. Use this to access user dashboard.',
            userId
        };
    }
    async adjustBalance(userId, dto, req) {
        const adminId = req.user.userId;
        const amount = new client_1.Prisma.Decimal(dto.amount);
        return this.prisma.$transaction(async (tx) => {
            const balance = await tx.balance.upsert({
                where: { userId_currency: { userId, currency: dto.currency } },
                create: {
                    userId,
                    currency: dto.currency,
                    available: dto.type === 'credit' ? amount : new client_1.Prisma.Decimal(0),
                    trading: new client_1.Prisma.Decimal(0),
                    locked: new client_1.Prisma.Decimal(0),
                },
                update: {
                    available: dto.type === 'credit'
                        ? { increment: amount }
                        : { decrement: amount },
                },
            });
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    type: 'adjustment',
                    amount: dto.type === 'credit' ? amount : amount.neg(),
                    currency: dto.currency,
                    status: 'completed',
                    reference: `ADJ-${Date.now()}`,
                    createdByAdminId: adminId,
                    metadata: { reason: dto.reason, type: dto.type },
                },
            });
            await tx.adminAuditLog.create({
                data: {
                    adminId,
                    actionType: 'adjust_balance',
                    targetType: 'user',
                    targetId: userId,
                    reason: dto.reason,
                    metadata: {
                        amount: dto.amount,
                        currency: dto.currency,
                        type: dto.type,
                        transactionId: transaction.id,
                    },
                },
            });
            return { balance, transaction };
        });
    }
    async getWithdrawals(status, page, limit) {
        const pageNum = parseInt(page || '1');
        const limitNum = parseInt(limit || '20');
        const skip = (pageNum - 1) * limitNum;
        const where = status ? { status } : {};
        const [withdrawals, total] = await Promise.all([
            this.prisma.withdrawalRequest.findMany({
                where,
                skip,
                take: limitNum,
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.withdrawalRequest.count({ where }),
        ]);
        return {
            withdrawals,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        };
    }
    async approveWithdrawal(withdrawalId, dto, req) {
        const adminId = req.user.userId;
        return this.prisma.$transaction(async (tx) => {
            const withdrawal = await tx.withdrawalRequest.findUnique({
                where: { id: withdrawalId },
                include: { user: true },
            });
            if (!withdrawal) {
                throw new Error('Withdrawal not found');
            }
            if (withdrawal.status !== 'requested') {
                throw new Error('Withdrawal already processed');
            }
            const updatedWithdrawal = await tx.withdrawalRequest.update({
                where: { id: withdrawalId },
                data: {
                    status: 'approved',
                    adminId,
                    adminNote: dto.note,
                    processedAt: new Date(),
                },
            });
            await tx.adminAuditLog.create({
                data: {
                    adminId,
                    actionType: 'approve_withdrawal',
                    targetType: 'withdrawal',
                    targetId: withdrawalId,
                    reason: dto.note,
                    metadata: {
                        userId: withdrawal.userId,
                        amount: withdrawal.amount.toString(),
                        currency: withdrawal.currency,
                    },
                },
            });
            return updatedWithdrawal;
        });
    }
    async rejectWithdrawal(withdrawalId, dto, req) {
        const adminId = req.user.userId;
        return this.prisma.$transaction(async (tx) => {
            const withdrawal = await tx.withdrawalRequest.findUnique({
                where: { id: withdrawalId },
            });
            if (!withdrawal) {
                throw new Error('Withdrawal not found');
            }
            if (withdrawal.status !== 'requested') {
                throw new Error('Withdrawal already processed');
            }
            await tx.balance.upsert({
                where: { userId_currency: { userId: withdrawal.userId, currency: withdrawal.currency } },
                create: {
                    userId: withdrawal.userId,
                    currency: withdrawal.currency,
                    available: withdrawal.amount,
                    trading: new client_1.Prisma.Decimal(0),
                    locked: new client_1.Prisma.Decimal(0),
                },
                update: {
                    available: { increment: withdrawal.amount },
                    locked: { decrement: withdrawal.amount },
                },
            });
            const updatedWithdrawal = await tx.withdrawalRequest.update({
                where: { id: withdrawalId },
                data: {
                    status: 'rejected',
                    adminId,
                    adminNote: dto.note,
                    processedAt: new Date(),
                },
            });
            await tx.adminAuditLog.create({
                data: {
                    adminId,
                    actionType: 'reject_withdrawal',
                    targetType: 'withdrawal',
                    targetId: withdrawalId,
                    reason: dto.note,
                    metadata: {
                        userId: withdrawal.userId,
                        amount: withdrawal.amount.toString(),
                        currency: withdrawal.currency,
                    },
                },
            });
            return updatedWithdrawal;
        });
    }
    async getAuditLog(page, limit) {
        const pageNum = parseInt(page || '1');
        const limitNum = parseInt(limit || '50');
        const skip = (pageNum - 1) * limitNum;
        const [logs, total] = await Promise.all([
            this.prisma.adminAuditLog.findMany({
                skip,
                take: limitNum,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.adminAuditLog.count(),
        ]);
        return {
            logs,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('sortBy')),
    __param(4, (0, common_1.Query)('sortOrder')),
    __param(5, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUser", null);
__decorate([
    (0, common_1.Post)('users/:id/freeze'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "freezeAccount", null);
__decorate([
    (0, common_1.Post)('users/:id/unfreeze'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "unfreezeAccount", null);
__decorate([
    (0, common_1.Post)('users/:id/reset-password'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('users/:id/impersonate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "impersonateUser", null);
__decorate([
    (0, common_1.Post)('users/:id/adjust-balance'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AdjustBalanceDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "adjustBalance", null);
__decorate([
    (0, common_1.Get)('withdrawals'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getWithdrawals", null);
__decorate([
    (0, common_1.Post)('withdrawals/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ApproveWithdrawalDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveWithdrawal", null);
__decorate([
    (0, common_1.Post)('withdrawals/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ApproveWithdrawalDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectWithdrawal", null);
__decorate([
    (0, common_1.Get)('audit-log'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAuditLog", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map