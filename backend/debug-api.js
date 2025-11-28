// Debug script to see the raw API response
const https = require('https');

const config = {
  apiKey: 'c1ca5df916msha636cb7af4c507cp16e40fjsn15ef7ba3e8a',
  host: 'online-code-compiler.p.rapidapi.com'
};

const postData = JSON.stringify({
  language: 'python3',
  version: 'latest',
  code: 'print("Hello, World!")',
  input: null
});

const options = {
  method: 'POST',
  hostname: config.host,
  port: null,
  path: '/v1/',
  headers: {
    'x-rapidapi-key': config.apiKey,
    'x-rapidapi-host': config.host,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🔍 Debug: Raw API Response');
console.log('Request data:', postData);
console.log('Headers:', options.headers);

const req = https.request(options, function (res) {
  console.log('\n📡 Response Status:', res.statusCode);
  console.log('📡 Response Headers:', res.headers);
  
  const chunks = [];
  
  res.on('data', function (chunk) {
    chunks.push(chunk);
    console.log('📦 Received chunk:', chunk.toString().substring(0, 100));
  });

  res.on('end', function () {
    const body = Buffer.concat(chunks);
    console.log('\n🔍 Complete Response Body:');
    console.log(body.toString());
    
    try {
      const parsed = JSON.parse(body.toString());
      console.log('\n✅ Parsed JSON:');
      console.log(JSON.stringify(parsed, null, 2));
    } catch (error) {
      console.log('\n❌ JSON Parse Error:', error.message);
    }
  });
});

req.on('error', function (error) {
  console.error('❌ Request Error:', error);
});

req.write(postData);
req.end();