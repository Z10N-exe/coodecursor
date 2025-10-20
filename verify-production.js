#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Production Readiness...\n');

const checks = [
  {
    name: 'Backend Build',
    command: 'cd backend && npm run build',
    critical: true
  },
  {
    name: 'Frontend Build', 
    command: 'cd frontend && npm run build',
    critical: true
  },
  {
    name: 'Admin Build',
    command: 'cd admin && npm run build',
    critical: true
  },
  {
    name: 'Backend Dependencies',
    command: 'cd backend && npm install --production',
    critical: true
  },
  {
    name: 'Database Schema',
    command: 'cd backend && npx prisma generate',
    critical: true
  }
];

let passed = 0;
let failed = 0;
const errors = [];

for (const check of checks) {
  try {
    console.log(`⏳ Running: ${check.name}...`);
    execSync(check.command, { stdio: 'pipe' });
    console.log(`✅ ${check.name} - PASSED`);
    passed++;
  } catch (error) {
    console.log(`❌ ${check.name} - FAILED`);
    console.log(`   Error: ${error.message}`);
    errors.push({ name: check.name, error: error.message });
    failed++;
    
    if (check.critical) {
      console.log(`🚨 CRITICAL ERROR in ${check.name}`);
    }
  }
}

console.log('\n📊 Production Readiness Summary:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

if (failed === 0) {
  console.log('\n🎉 ALL CHECKS PASSED! Your application is production-ready!');
  console.log('\n🚀 Next Steps:');
  console.log('1. Set up PostgreSQL database (Render, Railway, Supabase, or Neon)');
  console.log('2. Deploy backend to Render with your DATABASE_URL');
  console.log('3. Deploy frontend and admin to Render as static sites');
  console.log('4. Run database migrations: npx prisma migrate deploy');
  console.log('5. Seed database: npm run prisma:seed');
} else {
  console.log('\n⚠️  Some checks failed. Please fix the following issues:');
  errors.forEach(error => {
    console.log(`   - ${error.name}: ${error.error}`);
  });
}

process.exit(failed > 0 ? 1 : 0);
