import { useEffect, useRef } from 'react';

interface MathRendererProps {
  children: string;
  displayMode?: boolean;
  className?: string;
}

// Simple math notation renderer (placeholder for MathJax)
// In a real implementation, you would integrate with MathJax or KaTeX
export function MathRenderer({ children, displayMode = false, className = '' }: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a simplified placeholder implementation
    // In production, you would load and use MathJax here
    if (containerRef.current) {
      // Simple pattern replacements for common math notation
      let processed = children
        .replace(/\^(\w+)/g, '<sup>$1</sup>')
        .replace(/_(\w+)/g, '<sub>$1</sub>')
        .replace(/\\frac{([^}]+)}{([^}]+)}/g, '<span class="math-fraction"><span class="math-numerator">$1</span><span class="math-denominator">$2</span></span>')
        .replace(/\\sqrt{([^}]+)}/g, '√($1)')
        .replace(/\\sum/g, '∑')
        .replace(/\\int/g, '∫')
        .replace(/\\infty/g, '∞')
        .replace(/\\pi/g, 'π')
        .replace(/\\alpha/g, 'α')
        .replace(/\\beta/g, 'β')
        .replace(/\\gamma/g, 'γ')
        .replace(/\\delta/g, 'δ')
        .replace(/\\theta/g, 'θ')
        .replace(/\\lambda/g, 'λ')
        .replace(/\\mu/g, 'μ')
        .replace(/\\sigma/g, 'σ')
        .replace(/\\phi/g, 'φ')
        .replace(/\\omega/g, 'ω');

      containerRef.current.innerHTML = processed;
    }
  }, [children]);

  return (
    <div
      ref={containerRef}
      className={`math-renderer ${displayMode ? 'math-display' : 'math-inline'} ${className}`}
      style={{
        display: displayMode ? 'block' : 'inline',
        textAlign: displayMode ? 'center' : 'inherit',
        margin: displayMode ? '1em 0' : '0',
        fontSize: displayMode ? '1.2em' : 'inherit'
      }}
    />
  );
}

// CSS for math rendering (add to your global styles)
const mathStyles = `
.math-fraction {
  display: inline-block;
  vertical-align: middle;
  text-align: center;
}

.math-numerator {
  display: block;
  border-bottom: 1px solid currentColor;
  padding-bottom: 0.1em;
}

.math-denominator {
  display: block;
  padding-top: 0.1em;
}

.math-display {
  font-family: 'Times New Roman', serif;
  font-style: italic;
}

.math-inline {
  font-family: 'Times New Roman', serif;
  font-style: italic;
}
`;