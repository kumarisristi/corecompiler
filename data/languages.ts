export interface Language {
  id: string;
  name: string;
  category: string;
  icon: string;
  extension: string;
  monacoLanguage: string;
  defaultCode: string;
}

export const languages: Language[] = [
  {
    id: "html",
    name: "HTML",
    category: "Web",
    icon: "HTML",
    extension: ".html",
    monacoLanguage: "html",
    defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>Welcome to HTML programming.</p>
    
    <div class="container">
        <h2>Sample HTML Card</h2>
        <div class="card">
            <h3>HTML Card Component</h3>
            <p>This is a basic HTML card structure with styling.</p>
            <button onclick="alert('HTML Button Clicked!')">Click Me</button>
        </div>
    </div>
</body>
</html>`
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "Web",
    icon: "JS",
    extension: ".js",
    monacoLanguage: "javascript",
    defaultCode: `// JavaScript Code
console.log("Hello, World!");

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci(10):", fibonacci(10));`
  },
  {
    id: "css",
    name: "CSS",
    category: "Web",
    icon: "CSS",
    extension: ".css",
    monacoLanguage: "css",
    defaultCode: `/* CSS Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* HTML Card Styling */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.card p {
  color: #666;
  margin-bottom: 1.5rem;
}

.card button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.card button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}`
  },
  {
    id: "react",
    name: "React",
    category: "Web",
    icon: "React",
    extension: ".jsx",
    monacoLanguage: "javascript",
    defaultCode: `// React Component
import React, { useState } from 'react';

function HelloWorld() {
  const [count, setCount] = useState(0);

  return (
    <div className="hello-world">
      <h1>Hello, World!</h1>
      <p>Welcome to React programming.</p>
      
      <div className="card">
        <h3>React Counter</h3>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>
          Increment
        </button>
      </div>
    </div>
  );
}

export default HelloWorld;`
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "Web",
    icon: "Next",
    extension: ".tsx",
    monacoLanguage: "typescript",
    defaultCode: `// Next.js Page Component
"use client";

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('Hello from Next.js!');

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {message}
        </h1>
        <p className="text-gray-600 mb-6">
          Welcome to Next.js with TypeScript!
        </p>
        <button 
          onClick={() => setMessage('Next.js is awesome!')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Click me
        </button>
      </div>
    </main>
  );
}`
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Web",
    icon: "TS",
    extension: ".ts",
    monacoLanguage: "typescript",
    defaultCode: `// TypeScript Code
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "John Doe",
  age: 30
};

console.log("User:", user);`
  },
  {
    id: "python",
    name: "Python",
    category: "Scripting",
    icon: "PY",
    extension: ".py",
    monacoLanguage: "python",
    defaultCode: `# Python Code
print("Hello, World!")

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("Fibonacci(10):", fibonacci(10))`
  },
  {
    id: "java",
    name: "Java",
    category: "Systems",
    icon: "JV",
    extension: ".java",
    monacoLanguage: "java",
    defaultCode: `// Java Code
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        int result = fibonacci(10);
        System.out.println("Fibonacci(10): " + result);
    }
    
    static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`
  },
  {
    id: "cpp",
    name: "C++",
    category: "Systems",
    icon: "C++",
    extension: ".cpp",
    monacoLanguage: "cpp",
    defaultCode: `// C++ Code
#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    cout << "Hello, World!" << endl;
    cout << "Fibonacci(10): " << fibonacci(10) << endl;
    return 0;
}`
  },
  {
    id: "c",
    name: "C",
    category: "Systems",
    icon: "C",
    extension: ".c",
    monacoLanguage: "c",
    defaultCode: `// C Code
#include <stdio.h>

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    printf("Hello, World!\\n");
    printf("Fibonacci(10): %d\\n", fibonacci(10));
    return 0;
}`
  },
  {
    id: "csharp",
    name: "C#",
    category: "Systems",
    icon: "C#",
    extension: ".cs",
    monacoLanguage: "csharp",
    defaultCode: `// C# Code
using System;

class Program {
    static int Fibonacci(int n) {
        if (n <= 1) return n;
        return Fibonacci(n - 1) + Fibonacci(n - 2);
    }
    
    static void Main() {
        Console.WriteLine("Hello, World!");
        Console.WriteLine($"Fibonacci(10): {Fibonacci(10)}");
    }
}`
  },
  {
    id: "go",
    name: "Go",
    category: "Systems",
    icon: "GO",
    extension: ".go",
    monacoLanguage: "go",
    defaultCode: `// Go Code
package main

import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    fmt.Println("Hello, World!")
    fmt.Printf("Fibonacci(10): %d\\n", fibonacci(10))
}`
  },
  {
    id: "rust",
    name: "Rust",
    category: "Systems",
    icon: "RS",
    extension: ".rs",
    monacoLanguage: "rust",
    defaultCode: `// Rust Code
fn fibonacci(n: i32) -> i32 {
    if n <= 1 {
        return n;
    }
    fibonacci(n - 1) + fibonacci(n - 2)
}

fn main() {
    println!("Hello, World!");
    println!("Fibonacci(10): {}", fibonacci(10));
}`
  },
  {
    id: "php",
    name: "PHP",
    category: "Web",
    icon: "PHP",
    extension: ".php",
    monacoLanguage: "php",
    defaultCode: `<?php
// PHP Code
function fibonacci($n) {
    if ($n <= 1) return $n;
    return fibonacci($n - 1) + fibonacci($n - 2);
}

echo "Hello, World!\\n";
echo "Fibonacci(10): " . fibonacci(10) . "\\n";
?>`
  },
  {
    id: "ruby",
    name: "Ruby",
    category: "Scripting",
    icon: "RB",
    extension: ".rb",
    monacoLanguage: "ruby",
    defaultCode: `# Ruby Code
def fibonacci(n)
  return n if n <= 1
  fibonacci(n - 1) + fibonacci(n - 2)
end

puts "Hello, World!"
puts "Fibonacci(10): #{fibonacci(10)}"`
  },
  {
    id: "swift",
    name: "Swift",
    category: "Systems",
    icon: "SW",
    extension: ".swift",
    monacoLanguage: "swift",
    defaultCode: `// Swift Code
func fibonacci(_ n: Int) -> Int {
    if n <= 1 { return n }
    return fibonacci(n - 1) + fibonacci(n - 2)
}

print("Hello, World!")
print("Fibonacci(10): \\(fibonacci(10))")`
  },
  {
    id: "kotlin",
    name: "Kotlin",
    category: "Systems",
    icon: "KT",
    extension: ".kt",
    monacoLanguage: "kotlin",
    defaultCode: `// Kotlin Code
fun fibonacci(n: Int): Int {
    if (n <= 1) return n
    return fibonacci(n - 1) + fibonacci(n - 2)
}

fun main() {
    println("Hello, World!")
    println("Fibonacci(10): \${fibonacci(10)}")
}`
  },
  {
    id: "sql",
    name: "SQL",
    category: "Database",
    icon: "SQL",
    extension: ".sql",
    monacoLanguage: "sql",
    defaultCode: `-- SQL Code
SELECT 'Hello, World!' AS greeting;

-- Create a sample table
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

-- Insert sample data
INSERT INTO users VALUES (1, 'John Doe', 'john@example.com');

-- Query the data
SELECT * FROM users;`
  },
  {
    id: "r",
    name: "R",
    category: "Scripting",
    icon: "R",
    extension: ".r",
    monacoLanguage: "r",
    defaultCode: `# R Code
fibonacci <- function(n) {
  if (n <= 1) return(n)
  return(fibonacci(n - 1) + fibonacci(n - 2))
}

print("Hello, World!")
cat("Fibonacci(10):", fibonacci(10), "\\n")`
  },
  {
    id: "scala",
    name: "Scala",
    category: "Systems",
    icon: "SC",
    extension: ".scala",
    monacoLanguage: "scala",
    defaultCode: `// Scala Code
object Main {
  def fibonacci(n: Int): Int = {
    if (n <= 1) n
    else fibonacci(n - 1) + fibonacci(n - 2)
  }
  
  def main(args: Array[String]): Unit = {
    println("Hello, World!")
    println(s"Fibonacci(10): \${fibonacci(10)}")
  }
}`
  }
];

export const categories = ["All", "Web", "Scripting", "Systems", "Database"];
