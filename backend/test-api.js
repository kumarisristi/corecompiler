// Simple test script to verify API connectivity
const http = require('http');

// Test configuration
const API_BASE = 'http://localhost:5000';

// Test functions
async function testHealthEndpoint() {
  return new Promise((resolve) => {
    const req = http.get(`${API_BASE}/health`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('✅ Health check:', res.statusCode, JSON.parse(data));
        resolve(res.statusCode === 200);
      });
    });
    req.on('error', (err) => {
      console.log('❌ Health check failed:', err.message);
      resolve(false);
    });
  });
}

async function testLanguagesEndpoint() {
  return new Promise((resolve) => {
    const req = http.get(`${API_BASE}/api/compiler/languages`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log('✅ Languages check:', res.statusCode, json);
          resolve(res.statusCode === 200 && json.success);
        } catch (err) {
          console.log('❌ Languages parse error:', err.message);
          resolve(false);
        }
      });
    });
    req.on('error', (err) => {
      console.log('❌ Languages check failed:', err.message);
      resolve(false);
    });
  });
}

async function testCodeExecution() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      language: 'python',
      code: 'print("Hello from API test!")'
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/compiler/execute',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log('✅ Code execution:', res.statusCode, json);
          resolve(res.statusCode === 200 && json.success);
        } catch (err) {
          console.log('❌ Code execution parse error:', err.message);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log('❌ Code execution failed:', err.message);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting API connectivity tests...\n');

  const health = await testHealthEndpoint();
  console.log('');

  const languages = await testLanguagesEndpoint();
  console.log('');

  const execution = await testCodeExecution();
  console.log('');

  // Summary
  console.log('📊 Test Summary:');
  console.log(`Health Check: ${health ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Languages: ${languages ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Code Execution: ${execution ? '✅ PASS' : '❌ FAIL'}`);

  const allPassed = health && languages && execution;
  console.log(`\nOverall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

  if (!allPassed) {
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure backend server is running: npm run dev');
    console.log('2. Check if port 5000 is available');
    console.log('3. Verify API key in .env file');
    console.log('4. Check firewall settings');
  }

  process.exit(allPassed ? 0 : 1);
}

runTests();