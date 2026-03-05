// Simple setup helper for Supabase
// Run with: node setup-supabase.js

const fs = require('fs');
const path = require('path');

console.log('🚀 Supabase Setup Helper');
console.log('========================\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file exists');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL');
  const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  if (hasSupabaseUrl && hasSupabaseKey) {
    console.log('✅ Supabase variables found in .env.local');
    console.log('\n🧪 Next steps:');
    console.log('1. Test connection: http://localhost:3000/api/check-supabase');
    console.log('2. If table missing, run SQL script in Supabase');
    console.log('3. Test database: http://localhost:3000/api/test-database');
  } else {
    console.log('❌ Supabase variables missing from .env.local');
    console.log('\n📝 To fix:');
    console.log('1. Get your Supabase credentials from project settings');
    console.log('2. Add these lines to .env.local:');
    console.log('   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
    console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
  }
} else {
  console.log('❌ .env.local file not found');
  console.log('\n📝 To fix:');
  console.log('1. Copy .env.example to .env.local');
  console.log('2. Add your Supabase credentials');
  console.log('3. Restart the development server');
}

console.log('\n📚 Full guide: SUPABASE-SETUP-GUIDE.md');
console.log('🗄️ SQL script: supabase/create-tours-table.sql');
