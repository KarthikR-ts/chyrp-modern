import { useState } from 'react';
import { Comment } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommentForm } from './CommentForm';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, ExternalLink } from 'lucide-react';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onReply: (comment: Omit<Comment, 'id' | 'createdAt' | 'isApproved'>) => Promise<void>;
  level?: number;
}

export function CommentItem({ comment, postId, onReply, level = 0 }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  
  const maxLevel = 3;
  const canReply = level < maxLevel;

  const handleReply = async (replyData: Omit<Comment, 'id' | 'createdAt' | 'isApproved'>) => {
    await onReply({
      ...replyData,
      parentId: comment.id
    });
    setShowReplyForm(false);
  };

  return (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-muted pl-4' : ''}`}>
      <div className="flex space-x-3 mb-4">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>
            {comment.author.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-sm">{comment.author.name}</span>
            {comment.author.website && (
              <a
                href={comment.author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
            {!comment.isApproved && (
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                Pending Approval
              </span>
            )}
          </div>
          
          <div className="text-sm text-card-foreground mb-2 prose prose-sm max-w-none">
            {comment.content}
          </div>
          
          {canReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs h-auto p-1 hover-lift"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Reply
            </Button>
          )}
        </div>
      </div>

      {showReplyForm && (
        <div className="mb-4">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onSubmit={handleReply}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onReply={onReply}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}