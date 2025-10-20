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
exports.DepositsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const class_validator_1 = require("class-validator");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
class CreateDepositDto {
    amount;
    currency;
    method;
}
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], CreateDepositDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 3),
    __metadata("design:type", String)
], CreateDepositDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDepositDto.prototype, "method", void 0);
let DepositsController = class DepositsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(req, dto) {
        const userId = req.user.userId;
        const reference = `INV-${Date.now()}`;
        const tx = await this.prisma.transaction.create({
            data: {
                userId,
                type: 'deposit',
                amount: new client_1.Prisma.Decimal(dto.amount),
                currency: dto.currency,
                status: 'pending',
                reference,
                metadata: { method: dto.method },
            },
        });
        return {
            id: tx.id,
            reference,
            redirectUrl: 'https://checkout.example.com/' + reference,
        };
    }
};
exports.DepositsController = DepositsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateDepositDto]),
    __metadata("design:returntype", Promise)
], DepositsController.prototype, "create", null);
exports.DepositsController = DepositsController = __decorate([
    (0, common_1.Controller)('deposits'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DepositsController);
//# sourceMappingURL=deposits.controller.js.map