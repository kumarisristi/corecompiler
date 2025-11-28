'use client';

import React, { useState } from 'react';
import HTMLRunner from '@/components/HTMLRunner';

const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Runner Demo</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            max-width: 400px;
            text-align: center;
        }
        
        .card {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 1.5rem;
            margin: 1rem 0;
            border-left: 4px solid #667eea;
        }
        
        button {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.2s;
        }
        
        button:hover {
            transform: translateY(-2px);
        }
        
        input {
            width: 100%;
            padding: 8px;
            margin: 10px 0;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
        }
        
        input:focus {
            border-color: #667eea;
            outline: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 HTML Runner Demo</h1>
        <p>Welcome to the iframe-based HTML runner!</p>
        
        <div class="card">
            <h3>Interactive Elements</h3>
            <input type="text" id="nameInput" placeholder="Enter your name">
            <button onclick="greetUser()">Greet Me</button>
            <p id="greeting"></p>
        </div>
        
        <div class="card">
            <h3>Console Test</h3>
            <button onclick="testConsole()">Test Console Output</button>
            <button onclick="testError()">Test Error</button>
        </div>
        
        <div class="card">
            <h3>Counter</h3>
            <p>Count: <span id="counter">0</span></p>
            <button onclick="incrementCounter()">Increment</button>
            <button onclick="decrementCounter()">Decrement</button>
        </div>
    </div>
    
    <script>
        console.log('HTML Runner Demo initialized!');
        
        let counter = 0;
        
        function greetUser() {
            const name = document.getElementById('nameInput').value;
            const greeting = document.getElementById('greeting');
            
            if (name.trim()) {
                greeting.textContent = \`Hello, \${name}! Welcome to HTML Runner.\`;
                console.log('User greeted:', name);
                greeting.style.color = '#667eea';
                greeting.style.fontWeight = 'bold';
            } else {
                greeting.textContent = 'Please enter your name!';
                console.warn('Empty name input');
                greeting.style.color = '#e74c3c';
            }
        }
        
        function testConsole() {
            console.log('This is a log message');
            console.log('Object example:', { message: 'Hello', timestamp: new Date() });
            console.log('Array example:', [1, 2, 3, 'test']);
            alert('Check the console panel for output!');
        }
        
        function testError() {
            console.error('This is an error message');
            console.error('Error object:', new Error('Sample error'));
            try {
                throw new Error('This is a thrown error');
            } catch (e) {
                console.error('Caught error:', e.message);
            }
        }
        
        function incrementCounter() {
            counter++;
            document.getElementById('counter').textContent = counter;
            console.log('Counter incremented to:', counter);
        }
        
        function decrementCounter() {
            counter--;
            document.getElementById('counter').textContent = counter;
            console.log('Counter decremented to:', counter);
        }
        
        // Auto-run some demos
        setTimeout(() => {
            console.log('Auto-running demo after 2 seconds...');
            document.getElementById('nameInput').value = 'Developer';
            greetUser();
        }, 2000);
    </script>
</body>
</html>`;

export default function HTMLRunnerDemo() {
  const [code, setCode] = useState(sampleHTML);

  const loadSample = () => {
    setCode(sampleHTML);
  };

  const loadMinimalHTML = () => {
    setCode(`<!DOCTYPE html>
<html>
<head>
    <title>Minimal HTML</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is a minimal HTML example.</p>
    <button onclick="console.log('Button clicked!')">Click me</button>
</body>
</html>`);
  };

  const loadAdvancedHTML = () => {
    setCode(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Advanced HTML Demo</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
            background-size: 400% 400%;
            animation: gradient 3s ease infinite;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            max-width: 500px;
        }
        h1 { 
            font-size: 2.5em; 
            margin-bottom: 20px; 
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .feature {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 15px;
            transition: transform 0.3s ease;
        }
        .feature:hover {
            transform: translateY(-5px);
        }
        button {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s ease;
            margin: 5px;
        }
        button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Advanced HTML Runner</h1>
        <p>Experience the power of modern web development!</p>
        
        <div class="features">
            <div class="feature">
                <h3>🎨 CSS Grid</h3>
                <p>Modern layout techniques</p>
            </div>
            <div class="feature">
                <h3>✨ Animations</h3>
                <p>Smooth transitions</p>
            </div>
            <div class="feature">
                <h3>🎭 Glassmorphism</h3>
                <p>Modern UI design</p>
            </div>
            <div class="feature">
                <h3>📱 Responsive</h3>
                <p>Works on all devices</p>
            </div>
        </div>
        
        <div style="margin-top: 30px;">
            <button onclick="showFeatures()">Show Features</button>
            <button onclick="runTests()">Run Tests</button>
            <button onclick="generateReport()">Generate Report</button>
        </div>
        
        <div id="output" style="margin-top: 20px; min-height: 50px;"></div>
    </div>
    
    <script>
        console.log('🚀 Advanced HTML Runner initialized!');
        console.log('Current time:', new Date().toLocaleString());
        
        function showFeatures() {
            const features = [
                '✅ Pure HTML, CSS, and JavaScript',
                '✅ No external dependencies',
                '✅ Real-time preview',
                '✅ Console logging support',
                '✅ Responsive design',
                '✅ Modern CSS features',
                '✅ Interactive elements',
                '✅ Error handling'
            ];
            
            console.log('Feature check:');
            features.forEach(feature => console.log(feature));
            
            document.getElementById('output').innerHTML = 
                '<div style="background: rgba(0,255,0,0.1); padding: 15px; border-radius: 10px; text-align: left;">' +
                features.map(f => \`<div style="margin: 5px 0;">\${f}</div>\`).join('') +
                '</div>';
        }
        
        function runTests() {
            console.group('🧪 Running HTML Runner Tests');
            
            try {
                // Test 1: DOM manipulation
                const testDiv = document.createElement('div');
                testDiv.textContent = 'DOM Test';
                console.log('✅ DOM manipulation test passed');
                
                // Test 2: CSS styles
                const computedStyle = window.getComputedStyle(document.body);
                console.log('✅ CSS computed styles accessible');
                
                // Test 3: Event handling
                console.log('✅ Event system working');
                
                // Test 4: Console capture
                console.log('Test message from iframe');
                
                document.getElementById('output').innerHTML = 
                    '<div style="background: rgba(0,255,0,0.1); padding: 15px; border-radius: 10px;">' +
                    '<h4 style="color: #00ff00;">✅ All Tests Passed!</h4>' +
                    '<p>HTML Runner is working perfectly.</p>' +
                    '</div>';
                    
                console.groupEnd();
            } catch (error) {
                console.error('❌ Test failed:', error);
                document.getElementById('output').innerHTML = 
                    '<div style="background: rgba(255,0,0,0.1); padding: 15px; border-radius: 10px; color: #ff0000;">' +
                    '<h4>❌ Test Failed</h4>' +
                    '<p>' + error.message + '</p>' +
                    '</div>';
            }
        }
        
        function generateReport() {
            const report = {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                features: {
                    localStorage: typeof(Storage) !== "undefined",
                    geolocation: 'geolocation' in navigator,
                    notifications: 'Notification' in window
                }
            };
            
            console.log('📊 Performance Report:', report);
            
            document.getElementById('output').innerHTML = 
                '<div style="background: rgba(255,255,0,0.1); padding: 15px; border-radius: 10px; text-align: left; font-family: monospace;">' +
                '<h4 style="color: #ffff00;">📊 Report Generated</h4>' +
                '<pre style="font-size: 12px; white-space: pre-wrap;">' + 
                JSON.stringify(report, null, 2) + '</pre></div>';
        }
        
        // Auto-run initial tests
        setTimeout(() => {
            console.log('🎯 Auto-running initial tests...');
            runTests();
        }, 1000);
    </script>
</body>
</html>`);
  };



  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">🌐 HTML Runner Demo</h1>
              <p className="text-gray-600 mt-2">
                Complete iframe-based HTML runner (no Judge0 required!)
              </p>
            </div>
            <div className="flex space-x-2">
              <button onClick={loadSample} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Load Sample
              </button>
              <button onClick={loadMinimalHTML} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Minimal
              </button>
              <button onClick={loadAdvancedHTML} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                Advanced
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Features:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
              <div>✅ iframe.srcdoc rendering</div>
              <div>✅ Auto-run on code changes</div>
              <div>✅ Error handling</div>
              <div>✅ Real-time preview</div>
              <div>✅ Sandbox security</div>
              <div>✅ Cross-browser support</div>
              <div>✅ No backend required</div>
              <div>✅ Clean interface</div>
            </div>
          </div>
        </div>

        {/* Demo Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">HTML Code</h2>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 p-4 font-mono text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your HTML code here..."
              />
              <div className="mt-4 text-sm text-gray-500">
                <p>💡 <strong>Tip:</strong> Changes are automatically reflected in the preview. The HTML is rendered using iframe.srcdoc for security and isolation.</p>
              </div>
            </div>
          </div>

          {/* Preview and Console */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">HTML Preview</h2>
            </div>
            
            <div className="h-96">
              {/* HTML Preview */}
              <HTMLRunner
                code={code}
                autoRun={true}
                height="100%"
                className="h-full"
              />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🔧 Technical Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">How it works:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• HTML code is wrapped in a complete document</li>
                <li>• iframe.srcdoc is used for secure rendering</li>
                <li>• Real-time updates with 500ms debouncing</li>
                <li>• Error handling for JavaScript execution</li>
                <li>• Clean, simple interface</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Benefits:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• No external dependencies or Judge0</li>
                <li>• Instant preview without server</li>
                <li>• Secure sandboxed execution</li>
                <li>• Cross-browser compatibility</li>
                <li>• Clean, distraction-free interface</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}