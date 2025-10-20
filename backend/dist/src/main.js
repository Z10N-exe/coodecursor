"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const helmet_1 = __importDefault(require("helmet"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.use((0, helmet_1.default)());
    const allowedOrigins = process.env.NODE_ENV === 'production'
        ? [
            process.env.FRONTEND_URL || 'https://aspire-trade-frontend.onrender.com',
            process.env.ADMIN_URL || 'https://aspire-trade-admin.onrender.com'
        ]
        : ['http://localhost:3000', 'http://localhost:3002'];
    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`🚀 API Server running on port ${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 CORS enabled for origins: ${allowedOrigins.join(', ')}`);
}
bootstrap();
//# sourceMappingURL=main.js.map