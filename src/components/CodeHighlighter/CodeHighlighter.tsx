import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface CodeHighlighterProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
}

// Simple syntax highlighting for common languages
const highlightSyntax = (code: string, language: string) => {
  const patterns: Record<string, Array<{ pattern: RegExp; className: string }>> = {
    javascript: [
      { pattern: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await)\b/g, className: 'text-blue-600 font-semibold' },
      { pattern: /\b(true|false|null|undefined)\b/g, className: 'text-purple-600' },
      { pattern: /(["'`])(?:(?=(\\?))\2.)*?\1/g, className: 'text-green-600' },
      { pattern: /\/\/.*$/gm, className: 'text-gray-500 italic' },
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'text-gray-500 italic' },
    ],
    python: [
      { pattern: /\b(def|class|import|from|if|elif|else|for|while|return|try|except|with|as)\b/g, className: 'text-blue-600 font-semibold' },
      { pattern: /\b(True|False|None)\b/g, className: 'text-purple-600' },
      { pattern: /(["'])(?:(?=(\\?))\2.)*?\1/g, className: 'text-green-600' },
      { pattern: /#.*$/gm, className: 'text-gray-500 italic' },
    ],
    css: [
      { pattern: /([.#]?[a-zA-Z-]+)\s*{/g, className: 'text-blue-600' },
      { pattern: /([a-zA-Z-]+)\s*:/g, className: 'text-purple-600' },
      { pattern: /(['"])([^'"]*)\1/g, className: 'text-green-600' },
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'text-gray-500 italic' },
    ]
  };

  let highlighted = code;
  const langPatterns = patterns[language.toLowerCase()] || [];

  langPatterns.forEach(({ pattern, className }) => {
    highlighted = highlighted.replace(pattern, (match) => 
      `<span class="${className}">${match}</span>`
    );
  });

  return highlighted;
};

export function CodeHighlighter({ 
  code, 
  language, 
  filename, 
  showLineNumbers = true 
}: CodeHighlighterProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState('');

  useEffect(() => {
    setHighlightedCode(highlightSyntax(code, language));
  }, [code, language]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const lines = code.split('\n');

  return (
    <Card className="overflow-hidden bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-gray-400 uppercase">
            {language}
          </span>
          {filename && (
            <>
              <span className="text-gray-600">•</span>
              <span className="text-xs text-gray-300">{filename}</span>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="text-gray-400 hover:text-white hover:bg-gray-700 h-auto p-1"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Code Content */}
      <div className="relative overflow-x-auto">
        <pre className="p-4 text-sm">
          <code className="block">
            {showLineNumbers ? (
              <table className="w-full">
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index}>
                      <td className="text-gray-500 select-none pr-4 text-right align-top" style={{ minWidth: '3rem' }}>
                        {index + 1}
                      </td>
                      <td 
                        className="w-full align-top"
                        dangerouslySetInnerHTML={{ 
                          __html: highlightSyntax(line || ' ', language) 
                        }}
                      />
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: highlightedCode 
                }}
              />
            )}
          </code>
        </pre>
      </div>
    </Card>
  );
}