import { Body, Controller, HttpCode, Post, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsNumberString, IsString, Length } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

class CreateWithdrawalDto {
  @IsNumberString()
  amount!: string;

  @IsString()
  @Length(3, 3)
  currency!: string;

  @IsString()
  method!: string; // bank_transfer, etc.

  details!: Record<string, unknown>;
}

@Controller('withdrawals')
@UseGuards(AuthGuard('jwt'))
export class WithdrawalsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async create(@Req() req: any, @Body() dto: CreateWithdrawalDto) {
    const userId = req.user.userId as string;
    const amount = new Prisma.Decimal(dto.amount);

    const result = await this.prisma.$transaction(async (tx) => {
      const bal = await tx.balance.findFirst({ where: { userId, currency: dto.currency } });
      const available = new Prisma.Decimal(bal?.available ?? 0);
      if (available.lessThan(amount)) {
        throw new BadRequestException('Insufficient available balance');
      }
      const newAvailable = available.minus(amount);
      const newLocked = new Prisma.Decimal(bal?.locked ?? 0).plus(amount);

      await tx.balance.upsert({
        where: { userId_currency: { userId, currency: dto.currency } },
        create: { userId, currency: dto.currency, available: newAvailable, locked: newLocked, trading: new Prisma.Decimal(0) },
        update: { available: newAvailable, locked: newLocked },
      });

      const wr = await tx.withdrawalRequest.create({
        data: {
          userId,
          amount,
          currency: dto.currency,
          method: dto.method,
          details: dto.details as any,
          status: 'requested',
        } as any,
      });

      return wr;
    });

    return { id: result.id, status: result.status };
  }
}
