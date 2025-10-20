import { Body, Controller, Get, Param, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { IsString, IsNumberString, IsOptional, IsEnum } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { AdminAuthMiddleware } from './admin-auth.middleware';

class AdjustBalanceDto {
  @IsNumberString()
  amount!: string;

  @IsString()
  currency!: string;

  @IsEnum(['credit', 'debit'])
  type!: 'credit' | 'debit';

  @IsString()
  reason!: string;
}

class ApproveWithdrawalDto {
  @IsString()
  adminId!: string;

  @IsString()
  note!: string;
}

@Controller('admin')
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get('users')
  async getUsers(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('status') status?: string,
  ) {
    const pageNum = parseInt(page || '1');
    const limitNum = parseInt(limit || '20');
    const skip = (pageNum - 1) * limitNum;

    let where: any = {};
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { phoneE164: { contains: search } },
      ];
    }

    if (status) {
      if (status === 'frozen') {
        where.isFrozen = true;
      } else if (status === 'active') {
        where.isFrozen = false;
      } else if (status === 'kyc_pending') {
        where.kycStatus = 'pending';
      } else if (status === 'kyc_approved') {
        where.kycStatus = 'passed';
      }
    }

    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder || 'desc';
    } else {
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

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
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

  @Post('users/:id/freeze')
  async freezeAccount(@Param('id') userId: string, @Body() body: { reason: string }, @Req() req: any) {
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
        } as any,
      });

      return user;
    });
  }

  @Post('users/:id/unfreeze')
  async unfreezeAccount(@Param('id') userId: string, @Body() body: { reason: string }, @Req() req: any) {
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
        } as any,
      });

      return user;
    });
  }

  @Post('users/:id/reset-password')
  async resetPassword(@Param('id') userId: string, @Body() body: { newPassword: string, reason: string }, @Req() req: any) {
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
        } as any,
      });

      return { message: 'Password reset successfully' };
    });
  }

  @Post('users/:id/impersonate')
  async impersonateUser(@Param('id') userId: string, @Body() body: { reason: string }, @Req() req: any) {
    const adminId = req.user.userId;

    // Create audit log for impersonation
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
      } as any,
    });

    // Generate a special impersonation token
    const impersonationToken = `impersonate_${userId}_${Date.now()}`;
    
    return { 
      impersonationToken,
      message: 'Impersonation token generated. Use this to access user dashboard.',
      userId 
    };
  }

  @Post('users/:id/adjust-balance')
  async adjustBalance(@Param('id') userId: string, @Body() dto: AdjustBalanceDto, @Req() req: any) {
    const adminId = req.user.userId;
    const amount = new Prisma.Decimal(dto.amount);

    return this.prisma.$transaction(async (tx) => {
      // Update balance
      const balance = await tx.balance.upsert({
        where: { userId_currency: { userId, currency: dto.currency } },
        create: {
          userId,
          currency: dto.currency,
          available: dto.type === 'credit' ? amount : new Prisma.Decimal(0),
          trading: new Prisma.Decimal(0),
          locked: new Prisma.Decimal(0),
        },
        update: {
          available: dto.type === 'credit' 
            ? { increment: amount }
            : { decrement: amount },
        },
      });

      // Create transaction record
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
        } as any,
      });

      // Create audit log
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
        } as any,
      });

      return { balance, transaction };
    });
  }

  @Get('withdrawals')
  async getWithdrawals(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
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

  @Post('withdrawals/:id/approve')
  async approveWithdrawal(@Param('id') withdrawalId: string, @Body() dto: ApproveWithdrawalDto, @Req() req: any) {
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

      // Update withdrawal status
      const updatedWithdrawal = await tx.withdrawalRequest.update({
        where: { id: withdrawalId },
        data: {
          status: 'approved',
          adminId,
          adminNote: dto.note,
          processedAt: new Date(),
        },
      });

      // Create audit log
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
        } as any,
      });

      return updatedWithdrawal;
    });
  }

  @Post('withdrawals/:id/reject')
  async rejectWithdrawal(@Param('id') withdrawalId: string, @Body() dto: ApproveWithdrawalDto, @Req() req: any) {
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

      // Return locked funds to available
      await tx.balance.upsert({
        where: { userId_currency: { userId: withdrawal.userId, currency: withdrawal.currency } },
        create: {
          userId: withdrawal.userId,
          currency: withdrawal.currency,
          available: withdrawal.amount,
          trading: new Prisma.Decimal(0),
          locked: new Prisma.Decimal(0),
        },
        update: {
          available: { increment: withdrawal.amount },
          locked: { decrement: withdrawal.amount },
        },
      });

      // Update withdrawal status
      const updatedWithdrawal = await tx.withdrawalRequest.update({
        where: { id: withdrawalId },
        data: {
          status: 'rejected',
          adminId,
          adminNote: dto.note,
          processedAt: new Date(),
        },
      });

      // Create audit log
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
        } as any,
      });

      return updatedWithdrawal;
    });
  }

  @Get('audit-log')
  async getAuditLog(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
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
}
