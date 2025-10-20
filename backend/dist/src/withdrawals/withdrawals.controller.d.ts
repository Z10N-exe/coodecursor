import { PrismaService } from '../prisma/prisma.service';
declare class CreateWithdrawalDto {
    amount: string;
    currency: string;
    method: string;
    details: Record<string, unknown>;
}
export declare class WithdrawalsController {
    private prisma;
    constructor(prisma: PrismaService);
    create(req: any, dto: CreateWithdrawalDto): Promise<{
        id: string;
        status: string;
    }>;
}
export {};
