import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle } from 'lucide-react';

interface MathCaptchaProps {
  onVerify: (verified: boolean) => void;
  verified: boolean;
}

export function MathCaptcha({ onVerify, verified }: MathCaptchaProps) {
  const [question, setQuestion] = useState({ text: '', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);

  const generateQuestion = () => {
    const operations = [
      { symbol: '+', fn: (a: number, b: number) => a + b },
      { symbol: '-', fn: (a: number, b: number) => a - b },
      { symbol: '×', fn: (a: number, b: number) => a * b }
    ];
    
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let a: number, b: number;
    
    if (operation.symbol === '×') {
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 10) + 1;
    } else if (operation.symbol === '-') {
      a = Math.floor(Math.random() * 20) + 10;
      b = Math.floor(Math.random() * a);
    } else {
      a = Math.floor(Math.random() * 50) + 1;
      b = Math.floor(Math.random() * 50) + 1;
    }
    
    const answer = operation.fn(a, b);
    const text = `${a} ${operation.symbol} ${b} = ?`;
    
    setQuestion({ text, answer });
    setUserAnswer('');
    setAttempts(0);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect = parseInt(userAnswer) === question.answer;
    
    if (isCorrect) {
      onVerify(true);
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        generateQuestion();
      }
    }
  };

  if (verified) {
    return (
      <div className="flex items-center space-x-2 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm">Math problem solved correctly!</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="captcha">Security Check: Solve this math problem *</Label>
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <div className="bg-muted p-3 rounded text-center font-mono text-lg mb-2">
            {question.text}
          </div>
          <Input
            id="captcha"
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter your answer"
            required
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={generateQuestion}
          title="Generate new question"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
      
      {attempts > 0 && (
        <p className="text-sm text-destructive">
          Incorrect answer. {attempts >= 2 ? 'New question generated.' : 'Please try again.'}
        </p>
      )}
      
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!userAnswer}
        className="w-full"
      >
        Verify Answer
      </Button>
    </div>
  );
}