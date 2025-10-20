import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@Req() req: any) {
    const userId = req.user.userId as string;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const balances = await this.prisma.balance.findMany({ where: { userId } });
    return {
      profile: {
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phone: user?.phoneE164,
        country: user?.countryCode,
        kycStatus: user?.kycStatus,
        isFrozen: user?.isFrozen,
      },
      balances: balances.map(b => ({
        currency: b.currency,
        available: b.available.toString(),
        trading: b.trading.toString(),
        locked: b.locked.toString(),
      })),
    };
  }
}


