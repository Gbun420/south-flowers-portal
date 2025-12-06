// Test profile and role
const { createClient } = require('@supabase/supabase-js');

// Read environment variables
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

async function testProfile() {
  try {
    console.log('Testing profile for glennbundy@gmail.com...');
    
    // Get profile by email
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'glennbundy@gmail.com')
      .single();
    
    if (error) {
      console.error('Profile error:', error);
    } else {
      console.log('Profile found:', profile);
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testProfile();
