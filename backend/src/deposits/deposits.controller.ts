import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsNumberString, IsString, Length } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

class CreateDepositDto {
  @IsNumberString()
  amount!: string; // decimal string

  @IsString()
  @Length(3, 3)
  currency!: string;

  @IsString()
  method!: string; // e.g., stripe, paystack
}

@Controller('deposits')
@UseGuards(AuthGuard('jwt'))
export class DepositsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async create(@Req() req: any, @Body() dto: CreateDepositDto) {
    const userId = req.user.userId as string;
    const reference = `INV-${Date.now()}`;

    const tx = await this.prisma.transaction.create({
      data: {
        userId,
        type: 'deposit',
        amount: new Prisma.Decimal(dto.amount),
        currency: dto.currency,
        status: 'pending',
        reference,
        metadata: { method: dto.method },
      } as any,
    });

    return {
      id: tx.id,
      reference,
      redirectUrl: 'https://checkout.example.com/' + reference,
    };
  }
}
