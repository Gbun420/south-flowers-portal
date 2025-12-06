// Test auth callback directly
const http = require('http');

// Test if auth callback route responds
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/auth/callback?code=test123',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Response: ${data}`);
    console.log(`Location: ${res.headers.location}`);
  });
});

req.on('error', (err) => {
  console.error(`Error: ${err.message}`);
});

req.end();
