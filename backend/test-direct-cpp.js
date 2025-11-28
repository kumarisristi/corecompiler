// Test the direct C++ execution service
const https = require('https');

// Your exact C++ code that was failing
const cppCode = `#include <iostream> 
using namespace std;

int main() {
    int rows;
    cout << "Enter the number of rows for the star pattern: ";
    cin >> rows;

    for (int i = 1; i <= rows; ++i) {
        for (int j = 1; j <= i; ++j) {
            cout << "* ";
        }
        cout << endl;
    }

    return 0;
}`;

console.log('🧪 Testing Direct C++ Execution Service');
console.log('📝 Testing your exact C++ star pattern code');

const testData = {
  language: 'cpp',
  code: cppCode,
  input: '5\n' // Provide input for 5 rows
};

const postData = JSON.stringify(testData);

const options = {
  method: 'POST',
  hostname: 'localhost',
  port: 5000,
  path: '/api/compiler/execute',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('\n📡 Sending C++ code for execution...');

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n📥 Response Status:', res.statusCode);
    
    try {
      const result = JSON.parse(data);
      console.log('\n🎯 Execution Result:');
      
      if (result.success) {
        console.log('✅ Status:', result.data.status);
        console.log('📤 Output:');
        console.log(result.data.output);
        console.log('⏱️ Time:', result.data.executionTime, 'ms');
        
        if (result.data.status === 'success') {
          console.log('\n🎉 SUCCESS! Your C++ code is working now!');
          console.log('📋 You can copy this output to your panel');
        } else {
          console.log('\n⚠️ Status:', result.data.status);
          if (result.data.error) {
            console.log('❌ Error:', result.data.error);
          }
        }
      } else {
        console.log('\n❌ Request failed:', result.error);
      }
    } catch (error) {
      console.log('\n❌ Failed to parse response:', error.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Request failed:', error.message);
  console.log('💡 Make sure the backend server is running: npm run dev');
});

req.write(postData);
req.end();