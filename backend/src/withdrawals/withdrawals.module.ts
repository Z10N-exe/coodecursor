import { Module } from '@nestjs/common';
import { WithdrawalsController } from './withdrawals.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [WithdrawalsController],
  providers: [PrismaService],
})
export class WithdrawalsModule {}
