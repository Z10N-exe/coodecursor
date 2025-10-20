import { Module } from '@nestjs/common';
import { DepositsController } from './deposits.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DepositsController],
  providers: [PrismaService],
})
export class DepositsModule {}
