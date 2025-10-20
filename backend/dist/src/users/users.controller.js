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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersController = class UsersController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async me(req) {
        const userId = req.user.userId;
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
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "me", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersController);
//# sourceMappingURL=users.controller.js.map