"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const class_validator_1 = require("class-validator");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
class CreateWithdrawalDto {
    amount;
    currency;
    method;
    details;
}
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], CreateWithdrawalDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 3),
    __metadata("design:type", String)
], CreateWithdrawalDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWithdrawalDto.prototype, "method", void 0);
let WithdrawalsController = class WithdrawalsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(req, dto) {
        const userId = req.user.userId;
        const amount = new client_1.Prisma.Decimal(dto.amount);
        const result = await this.prisma.$transaction(async (tx) => {
            const bal = await tx.balance.findFirst({ where: { userId, currency: dto.currency } });
            const available = new client_1.Prisma.Decimal(bal?.available ?? 0);
            if (available.lessThan(amount)) {
                throw new common_1.BadRequestException('Insufficient available balance');
            }
            const newAvailable = available.minus(amount);
            const newLocked = new client_1.Prisma.Decimal(bal?.locked ?? 0).plus(amount);
            await tx.balance.upsert({
                where: { userId_currency: { userId, currency: dto.currency } },
                create: { userId, currency: dto.currency, available: newAvailable, locked: newLocked, trading: new client_1.Prisma.Decimal(0) },
                update: { available: newAvailable, locked: newLocked },
            });
            const wr = await tx.withdrawalRequest.create({
                data: {
                    userId,
                    amount,
                    currency: dto.currency,
                    method: dto.method,
                    details: dto.details,
                    status: 'requested',
                },
            });
            return wr;
        });
        return { id: result.id, status: result.status };
    }
};
exports.WithdrawalsController = WithdrawalsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateWithdrawalDto]),
    __metadata("design:returntype", Promise)
], WithdrawalsController.prototype, "create", null);
exports.WithdrawalsController = WithdrawalsController = __decorate([
    (0, common_1.Controller)('withdrawals'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WithdrawalsController);
//# sourceMappingURL=withdrawals.controller.js.map