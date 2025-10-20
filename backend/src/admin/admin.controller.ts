import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsString, IsNumberString, IsOptional, IsEnum } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

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
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get('users')
  async getUsers(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1');
    const limitNum = parseInt(limit || '20');
    const skip = (pageNum - 1) * limitNum;

    const where = search ? {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { phoneE164: { contains: search } },
      ],
    } : {};

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
        },
        orderBy: { createdAt: 'desc' },
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
