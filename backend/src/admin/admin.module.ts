import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminAuthMiddleware } from './admin-auth.middleware';

@Module({
  controllers: [AdminController],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminAuthMiddleware)
      .forRoutes('admin');
  }
}
