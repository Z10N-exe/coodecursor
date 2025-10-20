"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
let AdminAuthMiddleware = class AdminAuthMiddleware {
    use(req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Admin token required');
        }
        const token = authHeader.substring(7);
        const validTokens = [
            'demo-admin-token',
            process.env.ADMIN_TOKEN || 'admin-token-2024'
        ];
        if (!validTokens.includes(token)) {
            throw new common_1.UnauthorizedException('Invalid admin token');
        }
        req.user = {
            userId: 'admin-1',
            email: 'admin@aspiresecuretrade.com',
            role: 'SuperAdmin'
        };
        next();
    }
};
exports.AdminAuthMiddleware = AdminAuthMiddleware;
exports.AdminAuthMiddleware = AdminAuthMiddleware = __decorate([
    (0, common_1.Injectable)()
], AdminAuthMiddleware);
//# sourceMappingURL=admin-auth.middleware.js.map