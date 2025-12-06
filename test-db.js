// Test database connection
const { createClient } = require('@supabase/supabase-js');

// Read environment variables directly
const fs = require('fs');
const path = require('path');

function loadEnvVars() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    });
  }
}

loadEnvVars();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
    
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count');
    
    if (error) {
      console.error('Database error:', error);
    } else {
      console.log('Database connection successful!');
      console.log('Profiles count:', data);
    }
    
    // Test profile insertion
    const testProfile = {
      id: '00000000-0000-0000-0000-000000000000',
      email: 'test@example.com',
      role: 'member',
      monthly_limit_remaining: 30,
      full_name: 'Test User'
    };
    
    console.log('Testing profile insertion...');
    const { error: insertError } = await supabase.from('profiles').insert(testProfile);
    
    if (insertError) {
      console.error('Insert error:', insertError);
    } else {
      console.log('Profile insertion successful!');
    }
    
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection();
