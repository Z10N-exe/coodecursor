import { PrismaService } from '../prisma/prisma.service';
declare class CreateDepositDto {
    amount: string;
    currency: string;
    method: string;
}
export declare class DepositsController {
    private prisma;
    constructor(prisma: PrismaService);
    create(req: any, dto: CreateDepositDto): Promise<{
        id: string;
        reference: string;
        redirectUrl: string;
    }>;
}
export {};
