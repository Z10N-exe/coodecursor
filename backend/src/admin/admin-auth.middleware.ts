import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AdminAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Admin token required');
    }
    
    const token = authHeader.substring(7);
    
    // Simple admin token validation (in production, use proper JWT validation)
    const validTokens = [
      'demo-admin-token',
      process.env.ADMIN_TOKEN || 'admin-token-2024'
    ];
    
    if (!validTokens.includes(token)) {
      throw new UnauthorizedException('Invalid admin token');
    }
    
    // Add admin user to request
    (req as any).user = {
      userId: 'admin-1',
      email: 'admin@aspiresecuretrade.com',
      role: 'SuperAdmin'
    };
    
    next();
  }
}
