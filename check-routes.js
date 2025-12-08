const fs = require('fs');
const path = require('path');

const routesToCheck = [
  '/dashboard/profile',
  '/dashboard/messages', 
  '/dashboard/orders/123',
  '/dashboard/strains/456',
  '/staff/messages',
  '/auth/callback'
];

routesToCheck.forEach(route => {
  // Remove leading '/' from route before joining to 'src/app'
  const filePath = path.join('src/app', route.substring(1), 'page.tsx');
  if (!fs.existsSync(filePath)) {
    console.log(`❌ MISSING: ${route} -> ${filePath}`);
  } else {
    console.log(`✅ EXISTS: ${route}`);
  }
});