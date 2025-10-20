import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(payload: {
        firstName: string;
        lastName: string;
        email?: string;
        phone?: string;
        country: string;
        password: string;
        isAdult: boolean;
        acceptTerms: boolean;
    }): Promise<{
        message: string;
    }>;
    validateUser(identifier: string, password: string): Promise<{
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
    login(identifier: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string | null;
        };
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    logout(sessionId: string): Promise<void>;
}
