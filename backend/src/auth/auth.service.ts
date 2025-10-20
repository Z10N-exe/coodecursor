import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(payload: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    country: string;
    password: string;
    isAdult: boolean;
    acceptTerms: boolean;
  }): Promise<{ message: string }>
  {
    const passwordHash = await bcrypt.hash(payload.password, 12);
    await this.prisma.user.create({
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email?.toLowerCase(),
        phoneE164: payload.phone,
        countryCode: payload.country,
        passwordHash,
        isAdult: payload.isAdult,
      },
    });
    return { message: 'Verification required' };
  }

  async validateUser(identifier: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { phoneE164: identifier },
        ],
      },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(identifier: string, password: string) {
    const user = await this.validateUser(identifier, password);
    
    // Create session for refresh token
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, type: 'refresh' },
      { expiresIn: '7d' }
    );
    
    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: await bcrypt.hash(refreshToken, 12),
        userAgent: 'Web Client',
        ip: '127.0.0.1',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    const accessToken = await this.jwt.signAsync(
      { sub: user.id, sessionId: session.id },
      { expiresIn: '15m' }
    );
    
    return {
      accessToken,
      refreshToken,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken);
      if (payload.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      const session = await this.prisma.session.findFirst({
        where: {
          id: payload.sessionId,
          expiresAt: { gt: new Date() },
          revokedAt: null,
        },
      });

      if (!session) {
        throw new Error('Session not found or expired');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: session.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const newAccessToken = await this.jwt.signAsync(
        { sub: user.id, sessionId: session.id },
        { expiresIn: '15m' }
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async logout(sessionId: string) {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }
}


