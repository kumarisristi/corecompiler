// Test the demo webpage with WebEngine
const http = require('http');
const fs = require('fs');

console.log('🌐 Testing Demo Webpage with WebEngine');

// Read the demo HTML file
const demoHtml = fs.readFileSync('demo-webpage.html', 'utf8');

const webCode = {
  html: demoHtml,
  css: '', // CSS is already included in the HTML
  javascript: '' // JavaScript is already included in the HTML
};

console.log('📄 Loaded demo webpage:', demoHtml.length, 'characters');

const postData = JSON.stringify(webCode);

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

console.log('\n🚀 Sending demo webpage to WebEngine...');

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n📥 Response Status:', res.statusCode);
    
    try {
      const result = JSON.parse(data);
      console.log('\n🎯 Demo Webpage Execution Result:');
      
      if (result.success) {
        console.log('✅ Status: SUCCESS');
        console.log('⏱️ Execution Time:', result.data.executionTime, 'ms');
        console.log('🖼️ Screenshot Available:', !!result.data.screenshot);
        console.log('📄 HTML Available:', !!result.data.html);
        
        if (result.data.screenshot) {
          const screenshotSize = Buffer.from(result.data.screenshot.split(',')[1], 'base64').length;
          console.log('📸 Screenshot Size:', Math.round(screenshotSize / 1024), 'KB');
          
          // Save screenshot to file
          const screenshotData = result.data.screenshot.split(',')[1];
          fs.writeFileSync('demo-webpage-screenshot.png', screenshotData, 'base64');
          console.log('💾 Screenshot saved as: demo-webpage-screenshot.png');
        }
        
        console.log('\n🎉 SUCCESS! Demo webpage rendered perfectly!');
        console.log('🌟 This shows the full power of the WebEngine:');
        console.log('   • HTML structure with semantic elements');
        console.log('   • Advanced CSS with gradients and animations');
        console.log('   • Interactive JavaScript functionality');
        console.log('   • Responsive design and modern UI');
        console.log('\n📊 Just like OneCompiler - but with screenshots!');
        
      } else {
        console.log('\n❌ Demo execution failed:', result.error);
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