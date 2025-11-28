// Executable programming languages (supported by Judge0 API)
export const EXECUTABLE_LANGUAGES = [
  'javascript',
  'python', 
  'java',
  'cpp',
  'c',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'typescript'
];

// Non-executable languages (markup, styling, frameworks)
export const NON_EXECUTABLE_LANGUAGES = [
  'html',
  'css', 
  'react',
  'nextjs',
  'sql',
  'r',
  'scala',
  'csharp'
];

// Check if a language is executable
export function isExecutableLanguage(languageId: string): boolean {
  return EXECUTABLE_LANGUAGES.includes(languageId.toLowerCase());
}

// Get executable language display info
export function getExecutableLanguageInfo(languageId: string) {
  return {
    isExecutable: isExecutableLanguage(languageId),
    message: isExecutableLanguage(languageId) 
      ? 'This language can be executed'
      : 'This language cannot be executed (markup/framework)'
  };
}