'use client';

import React, { useState, useEffect, useRef } from 'react';

interface HTMLRunnerProps {
  code: string;
  className?: string;
  autoRun?: boolean;
  height?: string;
  sandboxMode?: 'allow-same-origin' | 'allow-scripts' | 'allow-forms' | 'allow-modals' | 'allow-popups';
}

const HTMLRunner: React.FC<HTMLRunnerProps> = ({
  code,
  className = '',
  autoRun = true,
  height = '400px',
  sandboxMode = 'allow-scripts allow-same-origin allow-forms allow-modals'
}) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [isRunning, setIsRunning] = useState(false);
  const [lastRunTime, setLastRunTime] = useState<Date | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Create the complete HTML document with mobile-optimized viewport
  const createCompleteHTML = (htmlCode: string): string => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0">
        <title>HTML Preview</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            height: 100%;
            width: 100%;
            overflow-x: hidden;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            -webkit-overflow-scrolling: auto;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.5;
            color: #333;
            background: #ffffff !important;
            min-height: 100vh;
            width: 100%;
            overflow-x: hidden;
            position: relative;
          }
          
          /* Mobile-optimized content handling */
          .mobile-content-wrapper {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
            position: relative;
          }
          
          /* Handle long content properly */
          .content-container {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
            word-wrap: break-word;
          }
          
          ${htmlCode.includes('<style') ? '' : `
          .default-content {
            padding: 20px;
            max-width: 100%;
            margin: 0 auto;
          }
          `}
        </style>
        ${htmlCode.includes('<style') ? htmlCode.match(/<style[\s\S]*?<\/style>/)?.[0] || '' : ''}
      </head>
      <body class="mobile-content-wrapper">
        <div class="content-container">
          ${htmlCode.includes('<style') ? htmlCode.replace(/<style[\s\S]*?<\/style>/, '') : htmlCode}
        </div>
        <script>
          // Prevent excessive scrolling only
          let scrollTimeout;
          document.addEventListener('touchmove', function(e) {
            if (Math.abs(e.touches[0].clientY) > 10) {
              clearTimeout(scrollTimeout);
              scrollTimeout = setTimeout(() => {
                e.preventDefault();
              }, 100);
            }
          }, { passive: true });
        </script>
      </body>
      </html>
    `;
  };

  const runCode = async () => {
    if (!iframeRef.current) return;
    
    setIsRunning(true);
    const htmlContent = createCompleteHTML(code);
    
    try {
      console.log('Running HTML code:', htmlContent.substring(0, 200) + '...');
      
      // Update iframe content
      if (iframeRef.current.srcdoc !== undefined) {
        iframeRef.current.srcdoc = htmlContent;
      } else {
        // Fallback for older browsers
        const doc = iframeRef.current.contentDocument;
        if (doc) {
          doc.open();
          doc.write(htmlContent);
          doc.close();
        }
      }
      
      setLastRunTime(new Date());
      
      // Add a small delay to ensure iframe is loaded
      setTimeout(() => {
        setIsRunning(false);
      }, 500);
      
    } catch (error) {
      console.error('Error running HTML code:', error);
      setIsRunning(false);
      
      // Show error in iframe
      if (iframeRef.current) {
        const errorHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Error</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; color: red; }
              .error { background: #ffe6e6; padding: 10px; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="error">
              <h3>Error Loading HTML:</h3>
              <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
          </body>
          </html>
        `;
        if (iframeRef.current.srcdoc !== undefined) {
          iframeRef.current.srcdoc = errorHTML;
        }
      }
    }
  };

  // Auto-run when code changes
  useEffect(() => {
    if (autoRun && code) {
      const timeoutId = setTimeout(runCode, 500); // Debounce
      return () => clearTimeout(timeoutId);
    }
  }, [code, autoRun]);



  // Initial run
  useEffect(() => {
    if (autoRun) {
      runCode();
    }
  }, []);

  const refresh = () => {
    runCode();
  };

  const openInNewTab = () => {
    if (typeof window !== 'undefined') {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(createCompleteHTML(code));
        newWindow.document.close();
      }
    }
  };

  return (
    <div className={`html-runner ${className} bg-white phone-view-container`}>
      {/* Iframe Preview */}
      <div className="relative h-full bg-white phone-view-container">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-none outline-none bg-white"
          sandbox={sandboxMode}
          title="HTML Preview"
          loading="lazy"
          style={{ 
            backgroundColor: 'white'
          }}
        />
        
        {isRunning && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
              <span className="text-xs">Running HTML...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HTMLRunner;