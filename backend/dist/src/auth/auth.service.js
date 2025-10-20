"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    prisma;
    jwt;
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async register(payload) {
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
    async validateUser(identifier, password) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier.toLowerCase() },
                    { phoneE164: identifier },
                ],
            },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return user;
    }
    async login(identifier, password) {
        const user = await this.validateUser(identifier, password);
        const refreshToken = await this.jwt.signAsync({ sub: user.id, type: 'refresh' }, { expiresIn: '7d' });
        const session = await this.prisma.session.create({
            data: {
                userId: user.id,
                refreshTokenHash: await bcrypt.hash(refreshToken, 12),
                userAgent: 'Web Client',
                ip: '127.0.0.1',
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        const accessToken = await this.jwt.signAsync({ sub: user.id, sessionId: session.id }, { expiresIn: '15m' });
        return {
            accessToken,
            refreshToken,
            user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
        };
    }
    async refreshToken(refreshToken) {
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
            const newAccessToken = await this.jwt.signAsync({ sub: user.id, sessionId: session.id }, { expiresIn: '15m' });
            return { accessToken: newAccessToken };
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
    async logout(sessionId) {
        await this.prisma.session.update({
            where: { id: sessionId },
            data: { revokedAt: new Date() },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map