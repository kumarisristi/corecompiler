// Editor Page with Resizable Output Panel
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Play, Download, Copy } from "lucide-react";
import { languages } from "@/data/languages";
import { useToast } from "@/hooks/use-toast";
import { isExecutableLanguage } from "@/lib/languageConfig";
import Editor from "@monaco-editor/react";
import HTMLRunner from "./HTMLRunner";

export default function EditorPage() {
  const params = useParams();
  const languageId = params.languageId;
  const router = useRouter();
  const { toast } = useToast();

  const language = languages.find((l) => l.id === languageId);

  const [code, setCode] = useState(language?.defaultCode || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  // Responsive initial panel width
  const getInitialPanelWidth = () => {
    if (typeof window === 'undefined') return 250;
    return window.innerWidth < 768 ? Math.min(300, window.innerWidth * 0.6) : 250;
  };
  
  const [panelWidth, setPanelWidth] = useState(getInitialPanelWidth());
  const [isResizing, setIsResizing] = useState(false);
  const [panelPosition, setPanelPosition] = useState<'right' | 'left' | 'full'>('right');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [phoneMode, setPhoneMode] = useState(false);
  const [selectedPhoneModel, setSelectedPhoneModel] = useState('galaxy-s24-ultra');

  useEffect(() => {
    if (language) setCode(language.defaultCode);
  }, [language]);

  // Resize Panel
  const startResizing = () => setIsResizing(true);
  const stopResizing = () => setIsResizing(false);
  const resizePanel = (e: MouseEvent) => {
    if (isResizing) {
      const maxWidth = isMobile ? window.innerWidth * 0.8 : 600;
      const minWidth = isMobile ? window.innerWidth * 0.3 : 150;
      setPanelWidth(Math.min(maxWidth, Math.max(minWidth, window.innerWidth - e.clientX)));
    }
  };

  // Panel Position Toggle
  const togglePanelPosition = () => {
    const positions: ('right' | 'left' | 'full')[] = ['right', 'left', 'full'];
    const currentIndex = positions.indexOf(panelPosition);
    const nextIndex = (currentIndex + 1) % positions.length;
    setPanelPosition(positions[nextIndex]);
  };

  // Update viewport size
  useEffect(() => {
    const updateViewport = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const isMobile = viewportSize.width < 768;
  const isTablet = viewportSize.width >= 768 && viewportSize.width < 1024;

  // Enhanced Phone Model Presets with Browser-like Layouts
  const phoneModels = {
    // Latest iPhone Models
    'iphone-16-pro': { 
      name: 'iPhone 16 Pro', 
      width: 393, 
      height: 852, 
      ratio: 393/852,
      layout: 'safari',
      hasNotch: false,
      hasHomeIndicator: true,
      statusBar: true,
      hasAddressBar: false,
      hasBottomBar: false,
      hasHolePunch: false,
      hasDynamicIsland: true,
      hasHomeButton: false,
      curvedEdges: false,
      browserStyle: false
    },
    'iphone-16': { 
      name: 'iPhone 16', 
      width: 390, 
      height: 844, 
      ratio: 390/844,
      layout: 'safari',
      hasNotch: true,
      hasHomeIndicator: true,
      statusBar: true,
      hasAddressBar: false,
      hasBottomBar: false,
      hasHolePunch: false,
      hasDynamicIsland: false,
      hasHomeButton: false,
      curvedEdges: false,
      browserStyle: false
    },
    'iphone-15-pro': { 
      name: 'iPhone 15 Pro', 
      width: 393, 
      height: 852, 
      ratio: 393/852,
      layout: 'safari',
      hasNotch: false,
      hasHomeIndicator: true,
      statusBar: true,
      hasAddressBar: false,
      hasBottomBar: false,
      hasHolePunch: false,
      hasDynamicIsland: true,
      hasHomeButton: false,
      curvedEdges: false,
      browserStyle: false
    },
    'iphone-15': { 
      name: 'iPhone 15', 
      width: 390, 
      height: 844, 
      ratio: 390/844,
      layout: 'safari',
      hasNotch: true,
      hasHomeIndicator: true,
      statusBar: true,
      hasAddressBar: false,
      hasBottomBar: false,
      hasHolePunch: false,
      hasDynamicIsland: false,
      hasHomeButton: false,
      curvedEdges: false,
      browserStyle: false
    },
    'iphone-14-pro': { 
      name: 'iPhone 14 Pro', 
      width: 393, 
      height: 852, 
      ratio: 393/852,
      layout: 'safari',
      hasNotch: false,
      hasHomeIndicator: true,
      statusBar: true,
      hasAddressBar: false,
      hasBottomBar: false,
      hasHolePunch: false,
      hasDynamicIsland: true,
      hasHomeButton: false,
      curvedEdges: false,
      browserStyle: false
    },
    'iphone-14': { 
      name: 'iPhone 14', 
      width: 390, 
      height: 844, 
      ratio: 390/844,
      layout: 'safari',
      hasNotch: true,
      hasHomeIndicator: true,
      statusBar: true,
      hasAddressBar: false,
      hasBottomBar: false,
      hasHolePunch: false,
      hasDynamicIsland: false,
      hasHomeButton: false,
      curvedEdges: false,
      browserStyle: false
    },
    'iphone-se': { 
      name: 'iPhone SE', 
      width: 375, 
      height: 667, 
      ratio: 375/667,
      layout: 'safari',
      hasNotch: false,
      hasHomeIndicator: false,
      statusBar: true,
      hasAddressBar: false,
      hasBottomBar: false,
      hasHolePunch: false,
      hasDynamicIsland: false,
      hasHomeButton: true,
      curvedEdges: false,
      browserStyle: false
    },
    
    // Samsung Galaxy Models
    'galaxy-s24-ultra': { 
      name: 'Galaxy S24 Ultra', 
      width: 412, 
      height: 915, 
      ratio: 412/915,
      layout: 'chrome',
      hasNotch: false,
      hasHomeIndicator: false,
      statusBar: true,
      hasAddressBar: false,
      hasBottomBar: true,
      hasHolePunch: true,
      hasDynamicIsland: false,
      hasHomeButton: false,
      curvedEdges: true,
      browserStyle: false
    },
    'galaxy-s24': { 
      name: 'Galaxy S24', 
      width: 360, 
      height: 780, 
      ratio: 360/780,
      layout: 'chrome',
      hasNotch: false,
      hasHomeIndicator: false,
      statusBar: true,
      hasAddressBar: false,
      hasBottomBar: false,
      hasHolePunch: true,
      hasDynamicIsland: false,
      hasHomeButton: false,
      curvedEdges: true,
      browserStyle: false
    },
    'galaxy-s23-ultra': { 
      name: 'Galaxy S23 Ultra', 
      width: 412, 
      height: 915, 
      ratio: 412/915,
      layout: 'chrome',
      hasNotch: false,
      hasHomeIndicator: false,
      statusBar: true,
      hasAddressBar: false,
      hasBottomBar: true,
      hasHolePunch: true,
      hasDynamicIsland: false,
      hasHomeButton: false,
      curvedEdges: true,
      browserStyle: false
    },
    'galaxy-s23': { 
      name: 'Galaxy S23', 
      width: 360, 
      height: 780, 
      ratio: 360/780,
      layout: 'chrome',
      hasNotch: false,
      hasHomeIndicator: false,
      statusBar: true,
      hasAddressBar: false,
      hasBottomBar: false,
      hasHolePunch: true,
      hasDynamicIsland: false,
      hasHomeButton: false,
      curvedEdges: true,
      browserStyle: false
    },
    
    // Google Pixel Models
    'pixel-8-pro': { 
      name: 'Pixel 8 Pro', 
      width: 412, 
      height: 915, 
      ratio: 412/915,
      layout: 'chrome',
      hasNotch: false,
      hasHomeIndicator: false,
      statusBar: true,
      hasAddressBar: false,
      hasBottomBar: true,
      hasHolePunch: true,
      hasDynamicIsland: false,
      hasHomeButton: false,
      curvedEdges: false,
      browserStyle: false
    },
    'pixel-8': { 
      name: 'Pixel 8', 
      width: 412, 
      height: 915, 
      ratio: 412/915,
      layout: 'chrome',
      hasNotch: false,
      hasHomeIndicator: false,
      statusBar: true,
      hasAddressBar: false,
      hasBottomBar: true,
      hasHolePunch: true,
      hasDynamicIsland: false,
      hasHomeButton: false,
      curvedEdges: false,
      browserStyle: false
    },
    'pixel-7-pro': { 
      name: 'Pixel 7 Pro', 
      width: 412, 
      height: 915, 
      ratio: 412/915,
      layout: 'chrome',
      hasNotch: false,
      hasHomeIndicator: false,
      statusBar: true,
      hasAddressBar: false,
      hasBottomBar: true,
      hasHolePunch: true,
      hasDynamicIsland: false,
      hasHomeButton: false,
      curvedEdges: false,
      browserStyle: false
    },
    'pixel-7': { 
      name: 'Pixel 7', 
      width: 412, 
      height: 915, 
      ratio: 412/915,
      layout: 'chrome',
      hasNotch: false,
      hasHomeIndicator: false,
      statusBar: true,
      hasAddressBar: false,
      hasBottomBar: true,
      hasHolePunch: true,
      hasDynamicIsland: false,
      hasHomeButton: false,
      curvedEdges: false,
      browserStyle: false
    },
    
    // Browser Modes
    'edge-mobile': {
      name: 'Edge Mobile',
      width: 375,
      height: 812,
      ratio: 375/812,
      layout: 'edge',
      hasNotch: false,
      hasHomeIndicator: false,
      statusBar: false,
      hasAddressBar: true,
      hasBottomBar: true,
      hasHolePunch: false,
      hasDynamicIsland: false,
      hasHomeButton: false,
      curvedEdges: false,
      browserStyle: true
    },
    'chrome-mobile': {
      name: 'Chrome Mobile',
      width: 375,
      height: 812,
      ratio: 375/812,
      layout: 'chrome-mobile',
      hasNotch: false,
      hasHomeIndicator: false,
      statusBar: false,
      hasAddressBar: true,
      hasBottomBar: true,
      hasHolePunch: false,
      hasDynamicIsland: false,
      hasHomeButton: false,
      curvedEdges: false,
      browserStyle: true
    },
    
    // Tablets
    'ipad-pro': { 
      name: 'iPad Pro', 
      width: 1024, 
      height: 1366, 
      ratio: 1024/1366,
      layout: 'ipad',
      hasNotch: false,
      hasHomeIndicator: false,
      statusBar: true,
      hasAddressBar: false,
      hasBottomBar: false,
      hasHolePunch: false,
      hasDynamicIsland: false,
      hasHomeButton: false,
      curvedEdges: false,
      browserStyle: false
    },
    'ipad': { 
      name: 'iPad', 
      width: 768, 
      height: 1024, 
      ratio: 768/1024,
      layout: 'ipad',
      hasNotch: false,
      hasHomeIndicator: false,
      statusBar: true,
      hasAddressBar: false,
      hasBottomBar: false,
      hasHolePunch: false,
      hasDynamicIsland: false,
      hasHomeButton: false,
      curvedEdges: false,
      browserStyle: false
    },
    
    'custom': { 
      name: 'Custom', 
      width: 375, 
      height: 667, 
      ratio: 375/667,
      layout: 'custom',
      hasNotch: false,
      hasHomeIndicator: false,
      statusBar: false,
      hasAddressBar: false,
      hasBottomBar: false,
      hasHolePunch: false,
      hasDynamicIsland: false,
      hasHomeButton: false,
      curvedEdges: false,
      browserStyle: false
    }
  };

  const currentPhoneModel = phoneModels[selectedPhoneModel as keyof typeof phoneModels];
  
  const togglePhoneMode = () => {
    setPhoneMode(!phoneMode);
  };

  useEffect(() => {
    window.addEventListener("mousemove", resizePanel);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resizePanel);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      // Force re-render on resize
      setIsMobileMenuOpen(false);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  const handleRun = async () => {
    setIsRunning(true);
    
    // For HTML, open in new tab
    if (String(languageId) === 'html') {
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>HTML Runner Output</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          </style>
        </head>
        <body>
          ${code}
        </body>
        </html>
      `;
      
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      }
      setIsRunning(false);
      return;
    }
    
    // Check if the language is executable
    if (!isExecutableLanguage(String(languageId))) {
      const langInfo = { message: 'This language cannot be executed (markup/framework)' };
      setOutput(
        `ℹ️  ${langInfo.message}\n\n` +
        `Language: ${language?.name || String(languageId)}\n` +
        `Type: ${language?.category || 'Markup/Framework'}\n\n` +
        `💡 This language cannot be executed because it's a markup language or framework.\n` +
        `Only programming languages like Python, JavaScript, Java, etc. can be executed.`
      );
      setIsRunning(false);
      return;
    }

    setOutput("Running code...\n");

    try {
      const { executeCode } = await import("@/lib/api");
      
      const result = await executeCode({
        language: String(languageId),
        code: code,
        timeLimit: 10000, // 10 seconds
        memoryLimit: 50000 // 50MB
      });

      if (result.success && result.data) {
        const { output, error, executionTime, status } = result.data;
        
        let displayOutput = "";
        
        if (error) {
          displayOutput += `❌ ERROR:\n${error}\n\n`;
        } else if (output) {
          displayOutput += `✅ SUCCESS:\n${output}\n\n`;
        } else {
          displayOutput += `✅ Code executed successfully (${status})\n\nNo output generated.\n\n`;
        }
        
        displayOutput += `⏱️  Execution Time: ${executionTime}ms\n`;
        displayOutput += `📊 Status: ${status.toUpperCase()}`;
        
        setOutput(displayOutput);
      } else {
        setOutput(
          `❌ Failed to execute code\n\nError: ${result.error || result.message || 'Unknown error'}\n\n` +
          `💡 Please check:\n` +
          `• Backend server is running on port 5000\n` +
          `• Code syntax is correct`
        );
      }
    } catch (error) {
      console.error('Execution error:', error);
      setOutput(
        `❌ Connection Error\n\n` +
        `Failed to connect to backend server.\n\n` +
        `💡 Please ensure:\n` +
        `• Backend server is running on http://localhost:5000\n` +
        `• No firewall blocking the connection\n` +
        `• Next.js development server is running`
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast({ title: "Code copied!", description: "Copied to clipboard" });
  };

  const handleDownload = () => {
    if (!language) return;
    
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code${language.extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const refresh = () => {
    // Force re-render of the HTML preview by updating the code
    const currentCode = code;
    setCode('');
    setTimeout(() => setCode(currentCode), 10);
  };

  const openInNewTab = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HTML Output</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        </style>
      </head>
      <body>
        ${code}
      </body>
      </html>
    `;
    
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  };

  if (!language) return <div>Language not found</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col select-none">
      {/* Compact Header */}
      <header className="border-b border-border bg-card">
        <div className={`container mx-auto ${isMobile ? 'px-2 py-1' : 'px-4 py-2'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">{language.name}</h1>
              <span className="text-sm text-muted-foreground">• {language.category}</span>
            </div>

            <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-1'}`}>
              {!isMobile && (
                <>
                  <button 
                    onClick={handleCopy} 
                    className="btn-secondary px-3 py-1 text-sm h-7 flex items-center gap-1 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 hover:shadow-sm"
                    title="Copy code to clipboard"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                  <button 
                    onClick={handleDownload} 
                    className="btn-secondary px-3 py-1 text-sm h-7 flex items-center gap-1 hover:bg-green-100 hover:border-green-300 transition-all duration-200 hover:shadow-sm"
                    title="Download code file"
                  >
                    <Download className="w-3 h-3" /> Download
                  </button>
                </>
              )}
              
              <button
                onClick={handleRun}
                disabled={isRunning}
                className={`btn-primary ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'} h-7 flex items-center gap-1 hover:bg-blue-600 transition-all duration-200 hover:shadow-md`}
              >
                <Play className="w-3 h-3" /> {isMobile ? 'Run' : (isRunning ? "Running..." : "Run")}
              </button>
              
              {/* Phone Mode Toggle - Only for HTML */}
              {String(languageId) === 'html' && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Phone mode toggle clicked, current state:', phoneMode);
                    setPhoneMode(!phoneMode);
                  }}
                  className={`btn-secondary px-2 py-1 text-xs h-7 flex items-center gap-1 transition-all duration-200 touch-target ${
                    phoneMode ? 'bg-blue-100 border-blue-300 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                  title={`Phone Mode: ${phoneMode ? 'ON (Galaxy S24 Ultra)' : 'OFF'} - Click to toggle`}
                  type="button"
                >
                  📱 {phoneMode ? 'ON' : 'OFF'}
                </button>
              )}
              
              {/* Panel Position Toggle - Hidden on mobile for HTML */}
              {!(isMobile && String(languageId) === 'html') && !phoneMode && (
                <button
                  onClick={togglePanelPosition}
                  className="btn-secondary px-2 py-1 text-xs h-7 flex items-center gap-1 hover:bg-orange-100 hover:border-orange-300 transition-all duration-200"
                  title={`Panel: ${panelPosition} (click to change)`}
                >
                  {panelPosition === 'right' && '→'}
                  {panelPosition === 'left' && '←'}
                  {panelPosition === 'full' && '⛶'}
                </button>
              )}
              
              {String(languageId) === 'html' && !isMobile && (
                <button
                  onClick={() => {
                    const htmlContent = `
                      <!DOCTYPE html>
                      <html lang="en">
                      <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>HTML Output</title>
                        <style>
                          * { margin: 0; padding: 0; box-sizing: border-box; }
                          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                        </style>
                      </head>
                      <body>
                        ${code}
                      </body>
                      </html>
                    `;
                    
                    const newWindow = window.open();
                    if (newWindow) {
                      newWindow.document.write(htmlContent);
                      newWindow.document.close();
                    }
                  }}
                  className="btn-secondary px-3 py-1 text-sm h-7 flex items-center gap-1 hover:bg-purple-100 hover:border-purple-300 transition-all duration-200 hover:shadow-sm"
                  title="Open in new tab"
                >
                  🔗 New Tab
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu for HTML - Available on all devices */}
      {String(languageId) === 'html' && (
        <div className={`fixed phone-menu-container ${isMobile ? 'top-2 right-2' : 'top-2 right-2'} z-40`}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className={`btn-primary p-2 sm:p-3 rounded-full shadow-lg border-2 transition-all duration-200 touch-target ${
              isMobile ? 'text-lg' : 'text-xl'
            } ${
              isMobileMenuOpen 
                ? 'border-blue-400 bg-blue-500 text-white' 
                : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50'
            }`}
            title="HTML Phone Models Menu"
            type="button"
          >
            <div className={isMobile ? 'text-lg' : 'text-xl'}>🌐</div>
          </button>
          
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-transparent backdrop touch-target"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMobileMenuOpen(false);
                }}
              />
              
              {/* Menu */}
              <div className="absolute top-12 right-0 bg-white border border-gray-300 rounded-xl shadow-2xl p-3 min-w-[280px] max-w-[340px] max-h-[70vh] overflow-y-auto mobile-menu menu">
                <div className="text-center mb-3 pb-2 border-b border-gray-100">
                  <div className="text-lg font-bold text-gray-800">🌐 HTML Mobile</div>
                  <div className="text-xs text-gray-500">Phone Model Selection</div>
                  
                  <div className="text-xs text-blue-600 mt-1">
                    Current: 📱 {currentPhoneModel.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {currentPhoneModel.width}×{currentPhoneModel.height} • {currentPhoneModel.layout}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {/* iPhone Models */}
                  <div className="text-xs text-gray-600 mb-2 font-semibold">🍎 iPhone Models:</div>
                  <div className="space-y-1 mb-4">
                    {Object.entries(phoneModels)
                      .filter(([key, model]) => model.name.includes('iPhone'))
                      .map(([key, model]) => (
                        <button
                          key={key}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedPhoneModel(key);
                            if (!phoneMode) setPhoneMode(true);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-xs text-left rounded-md transition-all duration-200 touch-target ${
                            selectedPhoneModel === key 
                              ? 'bg-blue-100 text-blue-700 border border-blue-300 shadow-sm' 
                              : 'hover:bg-gray-100 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{model.name}</span>
                            <div className="flex items-center gap-1">
                              {model.hasDynamicIsland && <span className="text-xs">🟫</span>}
                              {model.hasNotch && <span className="text-xs">📱</span>}
                              {model.hasHomeButton && <span className="text-xs">⬇️</span>}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {model.width}×{model.height} • {model.layout}
                          </div>
                        </button>
                      ))}
                  </div>

                  {/* Samsung Galaxy Models */}
                  <div className="text-xs text-gray-600 mb-2 font-semibold">📱 Samsung Galaxy:</div>
                  <div className="space-y-1 mb-4">
                    {Object.entries(phoneModels)
                      .filter(([key, model]) => model.name.includes('Galaxy'))
                      .map(([key, model]) => (
                        <button
                          key={key}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedPhoneModel(key);
                            if (!phoneMode) setPhoneMode(true);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-xs text-left rounded-md transition-all duration-200 touch-target ${
                            selectedPhoneModel === key 
                              ? 'bg-blue-100 text-blue-700 border border-blue-300 shadow-sm' 
                              : 'hover:bg-gray-100 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{model.name}</span>
                            <div className="flex items-center gap-1">
                              {model.hasHolePunch && <span className="text-xs">⚫</span>}
                              {model.curvedEdges && <span className="text-xs">🔄</span>}
                              {model.hasBottomBar && <span className="text-xs">⬇️</span>}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {model.width}×{model.height} • {model.layout}
                          </div>
                        </button>
                      ))}
                  </div>

                  {/* Google Pixel Models */}
                  <div className="text-xs text-gray-600 mb-2 font-semibold">🔵 Google Pixel:</div>
                  <div className="space-y-1 mb-4">
                    {Object.entries(phoneModels)
                      .filter(([key, model]) => model.name.includes('Pixel'))
                      .map(([key, model]) => (
                        <button
                          key={key}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedPhoneModel(key);
                            if (!phoneMode) setPhoneMode(true);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-xs text-left rounded-md transition-all duration-200 touch-target ${
                            selectedPhoneModel === key 
                              ? 'bg-blue-100 text-blue-700 border border-blue-300 shadow-sm' 
                              : 'hover:bg-gray-100 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{model.name}</span>
                            <div className="flex items-center gap-1">
                              {model.hasHolePunch && <span className="text-xs">⚫</span>}
                              {model.hasBottomBar && <span className="text-xs">⬇️</span>}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {model.width}×{model.height} • {model.layout}
                          </div>
                        </button>
                      ))}
                  </div>

                  {/* Browser Modes */}
                  <div className="text-xs text-gray-600 mb-2 font-semibold">🌐 Browser Modes:</div>
                  <div className="space-y-1 mb-4">
                    {Object.entries(phoneModels)
                      .filter(([key, model]) => model.browserStyle)
                      .map(([key, model]) => (
                        <button
                          key={key}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedPhoneModel(key);
                            if (!phoneMode) setPhoneMode(true);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-xs text-left rounded-md transition-all duration-200 touch-target ${
                            selectedPhoneModel === key 
                              ? 'bg-blue-100 text-blue-700 border border-blue-300 shadow-sm' 
                              : 'hover:bg-gray-100 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{model.name}</span>
                            <div className="flex items-center gap-1">
                              {model.hasAddressBar && <span className="text-xs">📍</span>}
                              {model.hasBottomBar && <span className="text-xs">⬇️</span>}
                              <span className="text-xs">🌐</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {model.width}×{model.height} • {model.layout}
                          </div>
                        </button>
                      ))}
                  </div>

                  {/* Tablets */}
                  <div className="text-xs text-gray-600 mb-2 font-semibold">📱 Tablets:</div>
                  <div className="space-y-1 mb-4">
                    {Object.entries(phoneModels)
                      .filter(([key, model]) => model.layout === 'ipad')
                      .map(([key, model]) => (
                        <button
                          key={key}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedPhoneModel(key);
                            if (!phoneMode) setPhoneMode(true);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-xs text-left rounded-md transition-all duration-200 touch-target ${
                            selectedPhoneModel === key 
                              ? 'bg-blue-100 text-blue-700 border border-blue-300 shadow-sm' 
                              : 'hover:bg-gray-100 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{model.name}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {model.width}×{model.height} • {model.layout}
                          </div>
                        </button>
                      ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t border-gray-200 pt-3 mt-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPhoneMode(!phoneMode);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-sm flex items-center justify-center gap-2 transition-all duration-200 touch-target ${
                        phoneMode 
                          ? 'bg-orange-100 text-orange-700 border border-orange-300 hover:bg-orange-200' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      📱 {phoneMode ? 'Disable' : 'Enable'} Phone Mode
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const htmlContent = `
                          <!DOCTYPE html>
                          <html lang="en">
                          <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>HTML Output</title>
                            <style>
                              * { margin: 0; padding: 0; box-sizing: border-box; }
                              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                            </style>
                          </head>
                          <body>
                            ${code}
                          </body>
                          </html>
                        `;
                        
                        const newWindow = window.open();
                        if (newWindow) {
                          newWindow.document.write(htmlContent);
                          newWindow.document.close();
                        }
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full mt-2 px-3 py-2 text-sm bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 touch-target"
                    >
                      🔗 Open in New Tab
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Enhanced Mobile Browser Layout */}
      {phoneMode && String(languageId) === 'html' ? (
        <div className={`flex flex-1 overflow-hidden bg-gray-100 ${isMobile ? 'mobile-stack-layout' : ''}`}>
          {/* Code Editor Panel */}
          <div className={`${isMobile ? 'w-full code-editor' : 'w-2/5'} border-r border-border flex flex-col bg-white ${isMobile ? 'order-2' : ''}`}>
            <div className="p-2 border-b border-border bg-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-blue-700">📝 HTML Code</span>
                  <span className="text-xs text-blue-600 bg-blue-100 px-1 rounded">Editor</span>
                </div>
                <div className="text-xs text-gray-500">
                  {currentPhoneModel.width}×{currentPhoneModel.height}
                </div>
              </div>
              {currentPhoneModel.browserStyle && (
                <div className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  {currentPhoneModel.layout} Browser Mode
                </div>
              )}
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage={language.monacoLanguage}
                value={code}
                onChange={(v) => setCode(v || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: isMobile ? 12 : 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 8, bottom: 8 },
                  wordWrap: "on",
                  renderWhitespace: "selection",
                }}
              />
            </div>
          </div>

          {/* Mobile Browser Preview */}
          <div className={`flex-1 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-2 sm:p-4 ${isMobile ? 'order-1 phone-preview' : ''}`}>
            <div className="relative w-full max-w-sm">
              {/* Browser-like Address Bar */}
              {currentPhoneModel.hasAddressBar && (
                <div className="mb-3 bg-white rounded-t-xl border border-gray-200 shadow-sm browser-address-bar">
                  <div className="flex items-center gap-2 p-3">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full px-3 py-1.5 text-xs text-gray-600">
                      https://html-preview.app
                    </div>
                    <button 
                      onClick={refresh}
                      className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 btn-mobile"
                    >
                      ↻
                    </button>
                  </div>
                </div>
              )}

              {/* Phone Frame */}
              <div 
                className={`mx-auto bg-gray-900 shadow-2xl phone-frame mobile-browser-frame relative ${
                  isMobile ? 'phone-frame-mobile' : ''
                } ${
                  currentPhoneModel.curvedEdges ? 'rounded-[3rem] curved-edges' : 'rounded-2xl'
                } p-1 ${
                  currentPhoneModel.hasHolePunch ? 'hole-punch' : ''
                } border-2 border-gray-700`}
                style={{
                  width: isMobile ? '300px' : `${Math.min(currentPhoneModel.width * 0.8, 360)}px`,
                  height: isMobile ? '520px' : `${Math.min(currentPhoneModel.height * 0.8, 600)}px`,
                  maxWidth: '380px',
                  maxHeight: '640px'
                }}
              >
                {/* Hole Punch (Pixel/Galaxy) */}
                {currentPhoneModel.hasHolePunch && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-black rounded-full z-20 status-bar-signal"></div>
                )}

                {/* Dynamic Island (iPhone 14 Pro) */}
                {currentPhoneModel.hasDynamicIsland && (
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-black rounded-full z-20 flex items-center justify-center dynamic-island">
                    <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                  </div>
                )}

                {/* Phone Screen */}
                <div 
                  className={`bg-white w-full h-full overflow-hidden relative border border-gray-800 ${
                    currentPhoneModel.curvedEdges ? 'rounded-[2.5rem]' : 'rounded-xl'
                  }`}
                  style={{
                    aspectRatio: `${currentPhoneModel.width}/${currentPhoneModel.height}`
                  }}
                >
                  {/* Browser-like Bottom Bar */}
                  {currentPhoneModel.hasBottomBar && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-800 flex items-center justify-around text-white text-xs mobile-bottom-nav mobile-browser-frame">
                      <div className="flex flex-col items-center touch-target">
                        <span>🏠</span>
                        <span>Home</span>
                      </div>
                      <div className="flex flex-col items-center touch-target">
                        <span>🔍</span>
                        <span>Search</span>
                      </div>
                      <div className="flex flex-col items-center touch-target">
                        <span>📋</span>
                        <span>Tabs</span>
                      </div>
                      <div className="flex flex-col items-center touch-target">
                        <span>👤</span>
                        <span>Profile</span>
                      </div>
                    </div>
                  )}

                  {/* Status Bar */}
                  {currentPhoneModel.statusBar && (
                    <div className="absolute top-0 left-0 right-0 h-6 bg-gray-900 flex items-center justify-between px-3 text-white text-xs z-30">
                      <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <div className="flex items-center space-x-1">
                        {currentPhoneModel.hasNotch && (
                          <div className="w-4 h-2 bg-white rounded-sm"></div>
                        )}
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                        <span>📶🔋</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Phone Screen Content */}
                  <div className={`w-full h-full phone-screen phone-view-container ${currentPhoneModel.hasBottomBar ? 'pb-8' : ''} ${currentPhoneModel.statusBar ? 'pt-6' : 'pt-0'} relative`}>
                    <HTMLRunner
                      code={code}
                      autoRun={true}
                      height="100%"
                      className="h-full w-full phone-iframe"
                      sandboxMode="allow-scripts"
                    />
                  </div>
                  
                  {/* Home Button (iPhone SE) */}
                  {currentPhoneModel.hasHomeButton && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 border-2 border-white rounded-full opacity-60"></div>
                  )}

                  {/* Home Indicator */}
                  {currentPhoneModel.hasHomeIndicator && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
                  )}
                </div>
              </div>
              
              {/* Browser Controls */}
              <div className="mt-4 flex justify-center gap-2 phone-controls">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    refresh();
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 btn-mobile touch-target shadow-sm"
                  title="Refresh HTML Preview"
                  type="button"
                >
                  ↻ Refresh
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openInNewTab();
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-all duration-200 btn-mobile touch-target shadow-sm"
                  title="Open in new tab"
                  type="button"
                >
                  🔗 New Tab
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMobileMenuOpen(true);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg text-xs hover:bg-gray-600 transition-all duration-200 btn-mobile touch-target shadow-sm"
                  title="Change Phone Model"
                  type="button"
                >
                  📱 Models
                </button>
              </div>
              
              {/* Phone Model Info */}
              <div className="text-center mt-3 p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-sm font-semibold text-gray-800">{currentPhoneModel.name}</div>
                <div className="text-xs text-gray-500 flex items-center justify-center gap-1 mt-1">
                  <span>{currentPhoneModel.width} × {currentPhoneModel.height}</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span className="capitalize">{currentPhoneModel.layout || 'custom'} Layout</span>
                </div>
                <div className="text-xs text-blue-600 mt-1 font-medium">
                  📱 Phone Mode Active
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Normal Layout */
        <div className="flex flex-1 overflow-hidden">
          {/* Code Editor */}
          {panelPosition !== 'full' && (
            <>
              {panelPosition === 'left' && (
                <div
                  className="border-r border-border bg-card flex flex-col"
                  style={{ width: panelWidth }}
                >
                  <div className="p-2 border-b border-border">
                    <h2 className="text-sm font-semibold">
                      {String(languageId) === 'html' ? 'HTML Preview' : 'Output'}
                    </h2>
                  </div>
                  
                  {String(languageId) === 'html' ? (
                    <div className="flex-1">
                      <HTMLRunner
                        code={code}
                        autoRun={true}
                        height="100%"
                        className="h-full"
                      />
                    </div>
                  ) : (
                    <div className="p-2 overflow-auto h-full">
                      <pre className="font-mono text-xs whitespace-pre-wrap">{output || "Run code to see output here..."}</pre>
                    </div>
                  )}
                </div>
              )}
              
              <div
                className={panelPosition === 'left' ? '' : 'border-r border-border'}
                style={{ 
                  width: panelPosition === 'left' ? `calc(100% - ${panelWidth}px)` : `calc(100% - ${panelWidth}px)` 
                }}
              >
                <Editor
                  height="100%"
                  defaultLanguage={language.monacoLanguage}
                  value={code}
                  onChange={(v) => setCode(v || "")}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 8, bottom: 8 },
                    wordWrap: "on",
                    renderWhitespace: "selection",
                  }}
                />
              </div>

              {/* Resizer Handle */}
              <div
                onMouseDown={startResizing}
                className="w-1 cursor-col-resize bg-border hover:bg-primary transition active:bg-primary/60"
              />

              {panelPosition === 'right' && (
                <div
                  className="border-l border-border bg-card flex flex-col"
                  style={{ width: panelWidth }}
                >
                  <div className="p-2 border-b border-border">
                    <h2 className="text-sm font-semibold">
                      {String(languageId) === 'html' ? 'HTML Preview' : 'Output'}
                    </h2>
                  </div>
                  
                  {String(languageId) === 'html' ? (
                    <div className="flex-1">
                      <HTMLRunner
                        code={code}
                        autoRun={true}
                        height="100%"
                        className="h-full"
                      />
                    </div>
                  ) : (
                    <div className="p-2 overflow-auto h-full">
                      <pre className="font-mono text-xs whitespace-pre-wrap">{output || "Run code to see output here..."}</pre>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Full Panel Mode */}
          {panelPosition === 'full' && (
            <div className="w-full bg-card flex flex-col">
              <div className="p-2 border-b border-border">
                <h2 className="text-sm font-semibold">
                  {String(languageId) === 'html' ? 'HTML Preview' : 'Output'}
                </h2>
              </div>
              
              {String(languageId) === 'html' ? (
                <div className="flex-1">
                  <HTMLRunner
                    code={code}
                    autoRun={true}
                    height="100%"
                    className="h-full"
                  />
                </div>
              ) : (
                <div className="p-2 overflow-auto h-full">
                  <pre className="font-mono text-xs whitespace-pre-wrap">{output || "Run code to see output here..."}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
