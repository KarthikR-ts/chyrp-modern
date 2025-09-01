import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { MathCaptcha } from '@/components/MathCaptcha/MathCaptcha';
import { Comment } from '@/types/blog';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSubmit: (comment: Omit<Comment, 'id' | 'createdAt' | 'isApproved'>) => Promise<void>;
  onCancel?: () => void;
}

export function CommentForm({ postId, parentId, onSubmit, onCancel }: CommentFormProps) {
  const [formData, setFormData] = useState({
    content: '',
    author: {
      name: '',
      email: '',
      website: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaVerified) {
      alert('Please solve the math problem first');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        content: formData.content,
        author: formData.author,
        parentId
      });
      
      setFormData({
        content: '',
        author: { name: '', email: '', website: '' }
      });
      setCaptchaVerified(false);
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              required
              value={formData.author.name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                author: { ...prev.author, name: e.target.value }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.author.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                author: { ...prev.author, email: e.target.value }
              }))}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="website">Website (Optional)</Label>
          <Input
            id="website"
            type="url"
            value={formData.author.website}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              author: { ...prev.author, website: e.target.value }
            }))}
          />
        </div>

        <div>
          <Label htmlFor="content">Comment *</Label>
          <Textarea
            id="content"
            required
            rows={4}
            value={formData.content}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              content: e.target.value
            }))}
            placeholder="Write your comment here..."
          />
        </div>

        <MathCaptcha
          onVerify={setCaptchaVerified}
          verified={captchaVerified}
        />

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isSubmitting || !captchaVerified}
            className="bg-gradient-primary hover:opacity-90"
          >
            {isSubmitting ? 'Submitting...' : 'Post Comment'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}