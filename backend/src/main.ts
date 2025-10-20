import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.use(helmet());
    
    // Configure CORS for production deployment
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
    
    app.useGlobalPipes(new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production'
    }));
    
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`🚀 API Server running on port ${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 CORS enabled for origins: ${allowedOrigins.join(', ')}`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Bootstrap error:', error);
  process.exit(1);
});
