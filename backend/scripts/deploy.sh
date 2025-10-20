#!/bin/bash

echo "🚀 Starting production deployment..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is not set"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Building application..."
npm run build

echo "🗄️ Running database migrations..."
npx prisma migrate deploy

echo "🌱 Seeding database..."
npm run prisma:seed

echo "✅ Deployment complete!"
echo "🌍 Server starting on port ${PORT:-3001}"
