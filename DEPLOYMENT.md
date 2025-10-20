# 🚀 Production Deployment Guide

## Database Setup (PostgreSQL)

### Option 1: Render PostgreSQL (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Choose a name: `aspire-trade-db`
4. Select "Free" plan
5. Copy the **External Database URL**

### Option 2: Railway PostgreSQL
1. Go to [Railway](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Copy the connection string

### Option 3: Supabase (Free)
1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy the connection string

### Option 4: Neon (Free)
1. Go to [Neon](https://neon.tech)
2. Create new project
3. Copy the connection string

## Backend Deployment (Render)

### 1. Prepare Backend
```bash
cd backend
npm install
```

### 2. Update Environment Variables
Create `.env` file in backend folder:
```env
DATABASE_URL="postgresql://username:password@hostname:port/database"
JWT_SECRET="your-super-secret-jwt-key-here"
NODE_ENV="production"
FRONTEND_URL="https://your-frontend-url.onrender.com"
ADMIN_URL="https://your-admin-url.onrender.com"
PORT=3001
ADMIN_TOKEN="your-admin-token-here"
```

### 3. Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `aspire-trade-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Environment**: `Node`

### 4. Set Environment Variables in Render
Add these in Render dashboard:
- `DATABASE_URL`: Your PostgreSQL URL
- `JWT_SECRET`: Strong secret key
- `NODE_ENV`: `production`
- `FRONTEND_URL`: Your frontend URL
- `ADMIN_URL`: Your admin URL
- `ADMIN_TOKEN`: Secure admin token

### 5. Run Database Migrations
After deployment, run:
```bash
npx prisma migrate deploy
npx prisma db seed
```

## Frontend Deployment (Render)

### 1. Deploy Frontend
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `aspire-trade-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `out`

### 2. Set Environment Variables
- `NEXT_PUBLIC_API_BASE`: `https://aspire-trade-backend.onrender.com/api`

## Admin Panel Deployment (Render)

### 1. Deploy Admin Panel
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `aspire-trade-admin`
   - **Root Directory**: `admin`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `out`

### 2. Set Environment Variables
- `NEXT_PUBLIC_API_BASE`: `https://aspire-trade-backend.onrender.com/api`
- `NEXT_PUBLIC_FRONTEND_URL`: `https://aspire-trade-frontend.onrender.com`

## Alternative Hosting Options

### Railway (All-in-One)
1. Go to [Railway](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Deploy backend, frontend, and admin as separate services

### Vercel (Frontend + Admin)
1. Deploy frontend to Vercel
2. Deploy admin to Vercel
3. Use Railway/Render for backend

### DigitalOcean App Platform
1. Create new app
2. Add PostgreSQL database
3. Deploy all services

## Environment Variables Summary

### Backend (.env)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-jwt-secret"
NODE_ENV="production"
FRONTEND_URL="https://your-frontend-url"
ADMIN_URL="https://your-admin-url"
PORT=3001
ADMIN_TOKEN="your-admin-token"
```

### Frontend (Environment Variables)
```env
NEXT_PUBLIC_API_BASE="https://your-backend-url/api"
```

### Admin (Environment Variables)
```env
NEXT_PUBLIC_API_BASE="https://your-backend-url/api"
NEXT_PUBLIC_FRONTEND_URL="https://your-frontend-url"
```

## Post-Deployment Steps

1. **Run Database Migrations**:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

2. **Test All Endpoints**:
   - Frontend: `https://your-frontend-url`
   - Admin: `https://your-admin-url`
   - API: `https://your-backend-url/api`

3. **Update CORS URLs** in backend if needed

4. **Test Admin Login**:
   - Email: `admin@aspiresecuretrade.com`
   - Password: `admin123`

## Troubleshooting

### Common Issues:
1. **Database Connection**: Check DATABASE_URL format
2. **CORS Errors**: Verify FRONTEND_URL and ADMIN_URL
3. **Build Failures**: Check Node.js version (18+)
4. **Environment Variables**: Ensure all are set correctly

### Logs:
- Check Render logs for backend issues
- Check build logs for frontend/admin issues
- Use `npx prisma studio` to inspect database

## Security Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Set strong ADMIN_TOKEN
- [ ] Use HTTPS for all URLs
- [ ] Enable database SSL
- [ ] Set up proper CORS origins
- [ ] Use environment variables for all secrets
