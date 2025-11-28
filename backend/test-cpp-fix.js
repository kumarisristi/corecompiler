// Test script to verify the file size limit fix
const https = require('https');

// Test C++ code that was causing file size limit error
const cppCode = `#include <iostream> // Include the iostream library for input/output operations

int main() { // Main function where program execution begins
    int rows; // Declare an integer variable to store the number of rows

    std::cout << "Enter the number of rows for the star pattern: "; // Prompt the user for input
    std::cin >> rows; // Read the number of rows from the user

    // Outer loop to iterate through each row
    for (int i = 1; i <= rows; ++i) { 
        // Inner loop to print stars in the current row
        for (int j = 1; j <= i; ++j) { 
            std::cout << "* "; // Print a star followed by a space
        }
        std::cout << std::endl; // Move to the next line after printing all stars in a row
    }

    return 0; // Indicate successful program execution
}`;

const testData = {
  language: 'cpp',
  code: cppCode,
  input: '5\n' // Provide input for the program
};

console.log('🧪 Testing C++ Code Execution Fix');
console.log('📝 Code length:', cppCode.length, 'characters');
console.log('🔤 Language:', testData.language);

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

console.log('\n📡 Sending request to backend...');

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n📥 Response Status:', res.statusCode);
    
    try {
      const result = JSON.parse(data);
      console.log('\n✅ Full Response:');
      console.log(JSON.stringify(result, null, 2));
      
      if (result.success) {
        console.log('\n🎯 Execution Result:');
        console.log('Status:', result.data.status);
        console.log('Output:', result.data.output || '(no output)');
        console.log('Error:', result.data.error || '(no error)');
        console.log('Time:', result.data.executionTime, 'ms');
        
        if (result.data.status === 'file_size_limit_exceeded') {
          console.log('\n❌ Still getting file size limit error!');
          console.log('💡 This indicates the issue is with Judge0 service itself');
        } else if (result.data.status === 'success') {
          console.log('\n✅ SUCCESS! Code executed properly');
        } else {
          console.log('\n⚠️ Different error occurred:', result.data.status);
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
  console.log('💡 Make sure the backend server is running on port 5000');
});

req.write(postData);
req.end();