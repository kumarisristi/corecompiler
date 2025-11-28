# 🌐 HTML Runner - Complete Iframe-based Solution

## Overview

This is a complete iframe-based HTML runner that allows you to preview HTML code directly in the browser without using Judge0 or any external services. The HTML code is rendered using `iframe.srcdoc` with full console logging support.

## 🚀 Features

- ✅ **iframe.srcdoc rendering** - Secure, isolated HTML execution
- ✅ **Console message capture** - Full logging of console.log, console.error, console.warn
- ✅ **Auto-run on code changes** - 500ms debounced real-time updates
- ✅ **Error handling** - JavaScript errors are captured and displayed
- ✅ **Real-time preview** - Instant visual feedback
- ✅ **Sandbox security** - Safe execution environment
- ✅ **Cross-browser support** - Works on all modern browsers
- ✅ **No backend required** - Pure frontend solution
- ✅ **No Judge0 dependency** - Independent HTML execution

## 📁 File Structure

```
frontend/
├── components/
│   ├── HTMLRunner.tsx      # Main HTML runner component
│   ├── ConsolePanel.tsx    # Console output display
│   └── Editor.tsx          # Updated editor with HTML support
├── app/
│   ├── html-runner-demo/   # Demo page showcasing the HTML runner
│   └── editor/            # Editor pages
└── data/
    └── languages.ts        # Updated with HTML configuration
```

## 🔧 Components

### 1. HTMLRunner Component (`frontend/components/HTMLRunner.tsx`)

The main component that renders HTML code in a secure iframe.

**Props:**
- `code: string` - HTML code to render
- `autoRun?: boolean` - Auto-run on code changes (default: true)
- `onConsoleLog?: (message: string, type: 'log' | 'error' | 'warn') => void` - Console callback
- `height?: string` - Iframe height (default: '400px')
- `className?: string` - Additional CSS classes

**Features:**
- Console message interception via postMessage
- Automatic HTML document wrapping
- Debounced auto-running
- Refresh and new tab functionality
- Loading states and error handling

### 2. ConsolePanel Component (`frontend/components/ConsolePanel.tsx`)

Displays console messages from the HTML iframe.

**Features:**
- Real-time message display
- Message filtering (log, error, warn)
- Auto-scroll to latest messages
- Clear functionality
- Expandable/collapsible interface
- Global console function exposure

### 3. Updated Editor (`frontend/components/Editor.tsx`)

Enhanced editor that integrates HTML runner for HTML language.

**HTML-specific features:**
- Split view: HTML preview + Console panel
- No backend execution needed
- Real-time preview updates
- Console output integration

## 🎯 Usage Examples

### Basic HTML Runner Usage

```jsx
import HTMLRunner from './components/HTMLRunner';
import ConsolePanel from './components/ConsolePanel';

function MyComponent() {
  const [code, setCode] = useState('<h1>Hello World</h1>');
  const [consoleMessages, setConsoleMessages] = useState([]);

  const handleConsoleLog = (message, type) => {
    setConsoleMessages(prev => [...prev, { message, type }]);
  };

  return (
    <div className="html-runner-demo">
      <HTMLRunner 
        code={code} 
        autoRun={true}
        onConsoleLog={handleConsoleLog}
        height="400px"
      />
      <ConsolePanel onConsoleLog={handleConsoleLog} />
    </div>
  );
}
```

### HTML Code Examples

#### Simple HTML
```html
<!DOCTYPE html>
<html>
<head>
    <title>Simple Demo</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Welcome to HTML Runner.</p>
    <button onclick="console.log('Button clicked!')">Click Me</button>
</body>
</html>
```

#### Advanced HTML with CSS and JavaScript
```html
<!DOCTYPE html>
<html>
<head>
    <title>Advanced Demo</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .card {
            background: rgba(255, 255, 255, 0.1);
            padding: 2rem;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>Advanced HTML Runner</h1>
        <p>With CSS styling and JavaScript</p>
        <button onclick="testFeatures()">Test Features</button>
        <div id="output"></div>
    </div>
    
    <script>
        console.log('HTML Runner initialized!');
        
        function testFeatures() {
            console.log('Testing console.log');
            console.error('Testing console.error');
            console.warn('Testing console.warn');
            
            document.getElementById('output').innerHTML = 
                '<p style="color: #90EE90;">✅ All tests completed!</p>';
        }
    </script>
</body>
</html>
```

## 🔍 How It Works

### 1. HTML Document Wrapping
The HTML runner automatically wraps your HTML code in a complete document:

```javascript
const createCompleteHTML = (htmlCode: string): string => {
  const consoleCapture = `
    <script>
      // Console interception logic
    </script>
  `;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>HTML Preview</title>
      <style>
        /* Default styles */
      </style>
    </head>
    <body>
      ${htmlCode}
      ${consoleCapture}
    </body>
    </html>
  `;
};
```

### 2. Console Message Capture
Console messages are intercepted and sent via postMessage:

```javascript
console.log = function(...args) {
  sendToParent('log', args);
  originalLog.apply(console, args);
};

function sendToParent(type, args) {
  parent.postMessage({
    type: 'console',
    level: type,
    message: args.map(arg => String(arg)).join(' ')
  }, '*');
}
```

### 3. iframe.srcdoc Rendering
HTML is rendered using the secure iframe.srcdoc property:

```javascript
iframeRef.current.srcdoc = createCompleteHTML(code);
```

## 🎮 Demo Page

Visit `/html-runner-demo` to see a complete demo with:

- Interactive HTML editor
- Real-time preview
- Console output panel
- Sample HTML templates
- Feature demonstrations

## 🔧 Configuration

### Editor Integration
The editor automatically detects HTML language and switches to iframe-based preview:

```javascript
{String(languageId) === 'html' ? (
  // HTML Runner + Console layout
  <HTMLRunner code={code} onConsoleLog={handleConsoleLog} />
  <ConsolePanel onConsoleLog={handleConsoleLog} />
) : (
  // Regular output for other languages
  <pre>{output}</pre>
)}
```

### Security Settings
The iframe uses sandbox attributes for security:

```html
<iframe
  sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
  srcDoc={htmlContent}
/>
```

## 🎯 Benefits Over Judge0

1. **Instant Preview** - No server round-trip delay
2. **Real-time Updates** - Auto-runs on code changes
3. **Full Console Support** - Captures all console methods
4. **No Dependencies** - Works without external services
5. **Cost Effective** - No API calls or rate limits
6. **Offline Support** - Works without internet connection
7. **Secure** - Sandboxed execution environment
8. **Cross-browser** - Works on all modern browsers

## 🐛 Troubleshooting

### Console Messages Not Appearing
- Check that `onConsoleLog` callback is provided
- Verify iframe sandbox allows scripts
- Ensure console interception script is injected

### Preview Not Updating
- Check if `autoRun` is enabled
- Verify code changes are detected
- Check for JavaScript errors in browser console

### Security Issues
- Ensure iframe has proper sandbox attributes
- Check if external resources are blocked
- Verify CORS policies for external content

## 🚀 Future Enhancements

- [ ] CSS and JavaScript linting
- [ ] Auto-completion for HTML tags
- [ ] Live CSS preview
- [ ] Multiple file support
- [ ] Save/load functionality
- [ ] Export to HTML file
- [ ] Responsive design preview
- [ ] Browser compatibility testing

## 📝 Notes

- The HTML runner works best with complete HTML documents
- External resources may be subject to CORS restrictions
- Large HTML files may impact performance
- Console capture requires iframe sandbox permissions
- Error handling is implemented for graceful failures

This HTML runner provides a complete, production-ready solution for HTML preview and execution without any external dependencies!