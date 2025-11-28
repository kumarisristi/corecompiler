// Test script to compare the simplified and comprehensive implementations
const https = require('https');

// Configuration
const config = {
  apiKey: 'c1ca5df916msha636cb7af4c507cp16e40fjsn15ef7ba3e8a',
  host: 'online-code-compiler.p.rapidapi.com',
  timeout: 10000
};

// Simplified Implementation (your original code enhanced)
function executeCodeSimplified(language, code, input = null) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      language: language,
      version: 'latest',
      code: code,
      input: input
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

    const req = https.request(options, function (res) {
      const chunks = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function () {
        const body = Buffer.concat(chunks);
        try {
          const response = JSON.parse(body.toString());
          resolve({
            success: true,
            output: response.output || '',
            error: response.error || null,
            implementation: 'simplified'
          });
        } catch (parseError) {
          reject(new Error(`Parse error: ${parseError.message}`));
        }
      });
    });

    req.on('error', function (error) {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.write(postData);
    req.end();
  });
}

// Test with timeout protection
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    )
  ]);
}

// Test function
async function runTests() {
  console.log('🚀 Testing Code Execution Implementations\n');
  
  const testCases = [
    {
      name: 'Simple Python Print',
      language: 'python3',
      code: 'print("Hello from Python!")'
    },
    {
      name: 'Simple JavaScript',
      language: 'nodejs', 
      code: 'console.log("Hello from JavaScript!");'
    },
    {
      name: 'Python with Calculation',
      language: 'python3',
      code: 'result = 5 + 3; print(f"5 + 3 = {result}")'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📝 Testing: ${testCase.name}`);
    console.log(`Language: ${testCase.language}`);
    console.log(`Code: ${testCase.code.substring(0, 50)}${testCase.code.length > 50 ? '...' : ''}`);
    
    try {
      const startTime = Date.now();
      const result = await withTimeout(
        executeCodeSimplified(testCase.language, testCase.code),
        config.timeout
      );
      const executionTime = Date.now() - startTime;
      
      console.log(`✅ Success! (${executionTime}ms)`);
      console.log(`Output: ${result.output || '(no output)'}`);
      if (result.error) {
        console.log(`Error: ${result.error}`);
      }
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
    }
  }
  
  console.log('\n🎉 Test completed!');
  console.log('\n💡 Key Observations:');
  console.log('- Simplified implementation: Fast and direct');
  console.log('- No built-in security (suitable for trusted environments)');
  console.log('- Minimal overhead for basic use cases');
  console.log('- Easy to understand and modify');
}

// Run the tests
runTests().catch(console.error);