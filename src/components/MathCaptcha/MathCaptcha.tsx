import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MathCaptchaProps {
  onVerify: (verified: boolean) => void;
  verified: boolean;
}

export function MathCaptcha({ onVerify, verified }: MathCaptchaProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [sessionId, setSessionId] = useState('');

  const generateQuestion = async () => {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1: number, num2: number, result: number, questionText: string;
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        result = num1 + num2;
        questionText = `${num1} + ${num2}`;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * 10) + 1;
        result = num1 - num2;
        questionText = `${num1} - ${num2}`;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        result = num1 * num2;
        questionText = `${num1} × ${num2}`;
        break;
      default:
        num1 = 1; num2 = 1; result = 2; questionText = '1 + 1';
    }

    const newSessionId = Math.random().toString(36).substring(2, 15);
    
    try {
      // Store captcha in database
      await supabase.from('captcha_sessions').insert({
        session_id: newSessionId,
        question: questionText,
        answer: result
      });
      
      setQuestion(questionText);
      setCorrectAnswer(result);
      setSessionId(newSessionId);
    } catch (error) {
      console.error('Error storing captcha:', error);
      // Fallback to client-side only
      setQuestion(questionText);
      setCorrectAnswer(result);
    }
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userNum = parseInt(userAnswer);
    
    if (userNum === correctAnswer) {
      onVerify(true);
    } else {
      setAttempts(prev => prev + 1);
      setUserAnswer('');
      
      if (attempts >= 2) {
        generateQuestion();
        setAttempts(0);
      }
    }
  };

  if (verified) {
    return (
      <div className="flex items-center space-x-2 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm">Verification complete</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          Security Check: What is {question}?
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            generateQuestion();
            setUserAnswer('');
            setAttempts(0);
          }}
        >
          <RefreshCw className="w-3 h-3" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Answer"
          className="flex-1"
          required
        />
        <Button type="submit" size="sm">
          Verify
        </Button>
      </form>
      
      {attempts > 0 && (
        <p className="text-sm text-destructive">
          Incorrect answer. Try again. ({attempts}/3 attempts)
        </p>
      )}
    </div>
  );
}