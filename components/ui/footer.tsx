"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  
  // Hide footer on dashboard page
  if (pathname === '/dashboard') {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">CodeLearn</h3>
                <p className="text-sm text-gray-400">Online Programming Hub</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Master programming languages with our interactive online compiler. 
              Write, run, and learn code in real-time with support for 20+ languages.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/compiler" className="text-gray-300 hover:text-white transition-colors">
                  Code Compiler
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-gray-300 hover:text-white transition-colors">
                  Learn Basics
                </Link>
              </li>
              <li>
                <Link href="/practice" className="text-gray-300 hover:text-white transition-colors">
                  Practice Problems
                </Link>
              </li>
              <li>
                <Link href="/certification" className="text-gray-300 hover:text-white transition-colors">
                  Get Certified
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Popular Languages */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <h4 className="text-lg font-semibold mb-4">Popular Languages</h4>
          <div className="flex flex-wrap gap-3">
            {[
              "JavaScript", "Python", "Java", "C++", "C", "TypeScript", 
              "HTML", "CSS", "React", "Next.js", "PHP", "Go", "Rust", "SQL"
            ].map((lang) => (
              <Link 
                key={lang}
                href={`/editor/${lang.toLowerCase()}`}
                className="bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                {lang}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 CodeLearn. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center mt-2 md:mt-0">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for developers
          </p>
        </div>
      </div>
    </footer>
  );
}