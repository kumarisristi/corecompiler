// Test script for WebEngine - Headless Chromium
const http = require('http');

// Test HTML/CSS/JavaScript code that will be rendered
const testWebCode = {
  html: `<!DOCTYPE html>
<html>
<head>
    <title>WebEngine Test</title>
</head>
<body>
    <h1 style="color: #2c3e50; text-align: center;">🌐 Headless Chromium WebEngine</h1>
    <div style="background: linear-gradient(45deg, #3498db, #e74c3c); padding: 20px; border-radius: 10px; color: white; text-align: center;">
        <h2>OneCompiler-Style Web Execution!</h2>
        <p>This is rendered in headless Chrome browser</p>
    </div>
    
    <div style="margin: 20px; padding: 15px; border: 2px solid #27ae60; border-radius: 5px;">
        <h3 style="color: #27ae60;">Features:</h3>
        <ul id="features-list">
            <li>HTML Rendering</li>
            <li>CSS Styling</li>
            <li>JavaScript Execution</li>
            <li>Screenshot Generation</li>
        </ul>
    </div>
    
    <button onclick="addFeature()" style="background: #9b59b6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px;">
        Add New Feature
    </button>
    
    <div id="timestamp" style="margin: 20px; font-family: monospace; background: #ecf0f1; padding: 10px; border-radius: 5px;"></div>
</body>
</html>`,
  
  css: `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
    background: #f8f9fa;
}

h1 {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
}`,

  javascript: `console.log('WebEngine JavaScript executed!');

function addFeature() {
    const featuresList = document.getElementById('features-list');
    const newFeature = document.createElement('li');
    newFeature.textContent = 'Dynamic Feature ' + (featuresList.children.length + 1);
    featuresList.appendChild(newFeature);
    
    // Update timestamp
    document.getElementById('timestamp').textContent = 
        'Last updated: ' + new Date().toLocaleString();
}

// Set initial timestamp
document.getElementById('timestamp').textContent = 
    'Page loaded: ' + new Date().toLocaleString();`
};

console.log('🧪 Testing Headless Chromium WebEngine');
console.log('📝 Testing HTML/CSS/JavaScript rendering');

const postData = JSON.stringify(testWebCode);

const options = {
  method: 'POST',
  hostname: 'localhost',
  port: 5000,
  path: '/api/web-engine/execute',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🔧 Using HTTP (not HTTPS) for local testing');

console.log('\n📡 Sending HTML/CSS/JS code to WebEngine...');

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n📥 Response Status:', res.statusCode);
    
    try {
      const result = JSON.parse(data);
      console.log('\n🎯 WebEngine Execution Result:');
      
      if (result.success) {
        console.log('✅ Status: SUCCESS');
        console.log('⏱️ Execution Time:', result.data.executionTime, 'ms');
        console.log('🖼️ Screenshot Available:', !!result.data.screenshot);
        console.log('📄 HTML Available:', !!result.data.html);
        
        if (result.data.screenshot) {
          const screenshotSize = Buffer.from(result.data.screenshot.split(',')[1], 'base64').length;
          console.log('📸 Screenshot Size:', Math.round(screenshotSize / 1024), 'KB');
          
          // Save screenshot to file
          const fs = require('fs');
          const screenshotData = result.data.screenshot.split(',')[1];
          fs.writeFileSync('webengine-screenshot.png', screenshotData, 'base64');
          console.log('💾 Screenshot saved as: webengine-screenshot.png');
        }
        
        console.log('\n🎉 SUCCESS! WebEngine working perfectly!');
        console.log('🌐 This is like OneCompiler - HTML/CSS/JS rendered in browser');
        
      } else {
        console.log('\n❌ WebEngine failed:', result.error);
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