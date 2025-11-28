# Backend API Endpoints Documentation

## Base URL
```
http://localhost:5000
```

## Available Endpoints

### 1. Health Check Endpoints

#### GET /health
**Description:** General server health check
**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-11-23T11:11:59.130Z",
  "uptime": 24.6319831,
  "environment": "development",
  "version": "1.0.0"
}
```

#### GET /api/compiler/health
**Description:** Code execution service health check with test execution
**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "responseTime": 154,
    "testExecution": {
      "status": "error",
      "hasOutput": false,
      "executionTime": 154
    },
    "timestamp": "2025-11-23T11:19:55.399Z"
  }
}
```

### 2. Code Execution Endpoints

#### POST /api/compiler/execute
**Description:** Execute code in various programming languages
**Rate Limiting:** 10 requests per minute per IP
**Request Body:**
```json
{
  "language": "python",        // Required: programming language
  "code": "print('Hello')",    // Required: code to execute
  "input": null,               // Optional: input for the program
  "timeLimit": 5000,           // Optional: max execution time (1000-30000ms)
  "memoryLimit": 50000         // Optional: max memory usage (1000-100000KB)
}
```

**Supported Languages:**
- `javascript` (Node.js)
- `python` (Python 3)
- `java`
- `cpp` (C++)
- `c` (C)
- `go` (Go)
- `rust` (Rust)
- `php` (PHP)
- `ruby` (Ruby)
- `swift` (Swift)
- `kotlin` (Kotlin)

**Success Response:**
```json
{
  "success": true,
  "data": {
    "output": "Hello World\n",
    "error": null,
    "executionTime": 156,
    "memoryUsage": 0,
    "status": "success"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Internal server error during code execution",
  "message": "You are not subscribed to this API."
}
```

### 3. Language Management Endpoints

#### GET /api/compiler/languages
**Description:** Get list of supported programming languages
**Response:**
```json
{
  "success": true,
  "data": {
    "languages": [
      "javascript",
      "python", 
      "java",
      "cpp",
      "c",
      "go",
      "rust",
      "php",
      "ruby",
      "swift",
      "kotlin"
    ],
    "count": 11
  }
}
```

### 4. Code Validation Endpoints

#### POST /api/compiler/validate
**Description:** Validate code syntax (basic validation)
**Request Body:**
```json
{
  "code": "print('Hello')",    // Required: code to validate
  "language": "python"         // Required: programming language
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "errors": []
  }
}
```

**Error Response:**
```json
{
  "success": true,
  "data": {
    "isValid": false,
    "errors": ["Indentation error detected"]
  }
}
```

### 5. Statistics Endpoints

#### GET /api/compiler/stats
**Description:** Get execution statistics and system info
**Response:**
```json
{
  "success": true,
  "data": {
    "supportedLanguages": 11,
    "uptime": 274.9987318,
    "memoryUsage": {
      "rss": 57397248,
      "heapTotal": 14286848,
      "heapUsed": 12833120,
      "external": 2341534,
      "arrayBuffers": 18635
    },
    "nodeVersion": "v22.20.0"
  }
}
```

## Error Responses

All endpoints return consistent error format:

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "type": "field",
      "msg": "Language is required",
      "path": "language",
      "location": "body"
    }
  ]
}
```

### Rate Limit Error (429)
```json
{
  "error": "Too many code execution requests, please try again later.",
  "retryAfter": "60 seconds"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error during code execution",
  "message": "You are not subscribed to this API."
}
```

### Route Not Found (404)
```json
{
  "error": "Route not found",
  "path": "/api/nonexistent",
  "method": "GET"
}
```

## Usage Examples

### Execute Python Code
```bash
curl -X POST http://localhost:5000/api/compiler/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "python",
    "code": "print(\"Hello, World!\")\nprint(\"Current time:\", __import__(\"datetime\").datetime.now())"
  }'
```

### Execute JavaScript Code
```bash
curl -X POST http://localhost:5000/api/compiler/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "javascript",
    "code": "console.log(\"Hello from Node.js!\");"
  }'
```

### Check Supported Languages
```bash
curl http://localhost:5000/api/compiler/languages
```

### Validate Code Syntax
```bash
curl -X POST http://localhost:5000/api/compiler/validate \
  -H "Content-Type: application/json" \
  -d '{
    "language": "python",
    "code": "print(\"Hello\")"
  }'
```

## Rate Limiting

- **Code Execution:** 10 requests per minute per IP
- **General API:** 100 requests per 15 minutes per IP

## Security Features

- **CORS Protection:** Configured for specific origins
- **Rate Limiting:** Prevents API abuse
- **Input Validation:** Comprehensive request validation
- **Error Handling:** Secure error responses (no sensitive data leakage)
- **Code Security:** Pattern-based malicious code detection

## Environment Configuration

Required environment variables:
```bash
PORT=5000
RAPIDAPI_KEY=your_api_key_here
RAPIDAPI_HOST=online-code-compiler.p.rapidapi.com
API_TIMEOUT=10000
NODE_ENV=development
```

## Starting the Backend Server

### Quick Start Commands
```bash
cd backend

# Development mode (auto-reload)
npm run dev

# Production build and start
npm run build
npm start
```

### Alternative Commands (if needed)
```bash
# Full server (requires additional dependencies)
npm run dev-full
npm run build-full
npm start-full
```

## Testing the API

You can test the API using:
1. **curl commands** (shown above)
2. **Postman/Insomnia** collections
3. **Frontend integration**
4. **Automated test scripts** (see `test-implementations.js`)