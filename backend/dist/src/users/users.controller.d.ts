import { PrismaService } from '../prisma/prisma.service';
export declare class UsersController {
    private prisma;
    constructor(prisma: PrismaService);
    me(req: any): Promise<{
        profile: {
            id: string | undefined;
            firstName: string | undefined;
            lastName: string | undefined;
            email: string | null | undefined;
            phone: string | null | undefined;
            country: string | undefined;
            kycStatus: string | undefined;
            isFrozen: boolean | undefined;
        };
        balances: {
            currency: string;
            available: string;
            trading: string;
            locked: string;
        }[];
    }>;
}
