"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, ChevronDown, User, BookOpen, Play, Info } from "lucide-react";
import Login from "./login";

export default function Navbar() {
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login state
  const pathname = usePathname();
  
  // Hide navbar on dashboard page or when logged in
  if (isLoggedIn || pathname === '/dashboard') {
    return null;
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CodeLearn</h1>
                <p className="text-xs text-gray-500">Online Programming Hub</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </Link>
              
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Dashboard
              </Link>
              
              {/* Course Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCourseOpen(!isCourseOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  <span>Courses</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {isCourseOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Learning Options</h3>
                    </div>
                    
                    <Link href="/learn" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                      <BookOpen className="h-4 w-4 mr-3" />
                      <div>
                        <div className="font-medium">Learn Basics</div>
                        <div className="text-xs text-gray-500">Start from scratch</div>
                      </div>
                    </Link>
                    
                    <Link href="/videos" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                      <Play className="h-4 w-4 mr-3" />
                      <div>
                        <div className="font-medium">Video Tutorials</div>
                        <div className="text-xs text-gray-500">Step-by-step videos</div>
                      </div>
                    </Link>
                    
                    <Link href="/practice" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                      <Code2 className="h-4 w-4 mr-3" />
                      <div>
                        <div className="font-medium">Practice Problems</div>
                        <div className="text-xs text-gray-500">Solve challenges</div>
                      </div>
                    </Link>
                    
                    <Link href="/certification" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                      <div className="h-4 w-4 mr-3 bg-yellow-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">Get Certified</div>
                        <div className="text-xs text-gray-500">Earn certificates</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
              
              <Link href="/about" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                <Info className="h-4 w-4" />
                <span>About Us</span>
              </Link>
            </div>

            {/* Login Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowLogin(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Login Component */}
      <Login 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLogin={() => setIsLoggedIn(true)} 
      />
    </>
  );
}