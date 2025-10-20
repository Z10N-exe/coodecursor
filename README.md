# Aspire Secure Trade

A production-ready forex/trading web application with separate frontend, admin panel, and backend services designed for deployment on Render.

## Architecture

- **Frontend** (`frontend/`): Next.js user-facing application
- **Admin Panel** (`admin/`): Next.js admin dashboard
- **Backend** (`backend/`): NestJS API server with Prisma ORM

## Features

### User Features
- User registration and authentication with JWT tokens
- Real-time dashboard with balance overview
- Deposit and withdrawal requests
- Transaction history
- Responsive design with glassmorphism UI

### Admin Features
- User management and search
- Balance adjustments (credit/debit)
- Withdrawal approval/rejection
- Audit logging
- Real-time data updates

### Technical Features
- JWT authentication with refresh tokens
- Real-time data updates
- CORS configuration for production
- Database migrations with Prisma
- TypeScript throughout
- Mobile-first responsive design

## Development Setup

### Prerequisites
- Node.js 18+
- npm

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Copy the example file
   cp apps/api/env.example apps/api/.env
   
   # Edit the .env file with your values
   # DATABASE_URL="file:./dev.db"
   # JWT_SECRET="your-secret-key"
   ```

3. **Run database migrations:**
   ```bash
   cd apps/api
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start all services:**
   ```bash
   # All services (frontend, admin, backend)
   npm run dev
   
   # Or start individually:
   npm run dev:frontend  # Frontend + Backend
   npm run dev:admin-panel  # Admin + Backend
   ```

### Service URLs
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3002
- **Backend API**: http://localhost:3001

## Production Deployment on Render

### 1. Backend API Deployment

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use these settings:
   - **Build Command**: `cd apps/api && npm install && npm run build`
   - **Start Command**: `cd apps/api && npm run start:prod`
   - **Environment**: Node
   - **Plan**: Free

4. Add environment variables:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: Generate a secure random string
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `FRONTEND_URL`: `https://your-frontend-url.onrender.com`
   - `ADMIN_URL`: `https://your-admin-url.onrender.com`

### 2. Frontend Deployment

1. Create a new Static Site
2. Use these settings:
   - **Build Command**: `cd apps/web && npm install && npm run build`
   - **Publish Directory**: `apps/web/.next`
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_BASE`: `https://your-api-url.onrender.com/api`

### 3. Admin Panel Deployment

1. Create a new Static Site
2. Use these settings:
   - **Build Command**: `cd apps/admin && npm install && npm run build`
   - **Publish Directory**: `apps/admin/.next`
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_BASE`: `https://your-api-url.onrender.com/api`

### 4. Database Setup

1. Create a PostgreSQL database on Render
2. Update the `DATABASE_URL` in your backend environment variables
3. Run migrations:
   ```bash
   cd apps/api
   npx prisma migrate deploy
   ```

## Environment Variables

### Backend (apps/api)
```env
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV="production"
FRONTEND_URL="https://your-frontend-url.onrender.com"
ADMIN_URL="https://your-admin-url.onrender.com"
PORT=3001
```

### Frontend (apps/web)
```env
NEXT_PUBLIC_API_BASE="https://your-api-url.onrender.com/api"
```

### Admin Panel (apps/admin)
```env
NEXT_PUBLIC_API_BASE="https://your-api-url.onrender.com/api"
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### User
- `GET /api/users/me` - Get current user profile and balances

### Deposits
- `POST /api/deposits` - Create deposit request

### Withdrawals
- `POST /api/withdrawals` - Create withdrawal request

### Admin
- `GET /api/admin/users` - List users with search
- `GET /api/admin/users/:id` - Get user details
- `POST /api/admin/users/:id/adjust-balance` - Adjust user balance
- `GET /api/admin/withdrawals` - List withdrawal requests
- `POST /api/admin/withdrawals/:id/approve` - Approve withdrawal
- `POST /api/admin/withdrawals/:id/reject` - Reject withdrawal
- `GET /api/admin/audit-log` - Get audit log

## Database Schema

The application uses Prisma with the following main models:
- `User` - User accounts
- `Balance` - User balances by currency
- `Transaction` - All financial transactions
- `WithdrawalRequest` - Withdrawal requests
- `AdminUser` - Admin accounts
- `AdminAuditLog` - Admin action logs
- `Session` - User sessions for refresh tokens

## Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- CORS configuration
- Input validation with class-validator
- Helmet for security headers
- Rate limiting ready (can be added)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
