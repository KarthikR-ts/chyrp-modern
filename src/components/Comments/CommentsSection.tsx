import { useState } from 'react';
import { Comment } from '@/types/blog';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';
import { Card } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

interface CommentsSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'isApproved'>) => Promise<void>;
}

export function CommentsSection({ postId, comments, onAddComment }: CommentsSectionProps) {
  const [showForm, setShowForm] = useState(false);

  // Filter out replies and organize them properly
  const topLevelComments = comments.filter(comment => !comment.parentId);
  
  const organizeReplies = (parentId: string): Comment[] => {
    return comments
      .filter(comment => comment.parentId === parentId)
      .map(comment => ({
        ...comment,
        replies: organizeReplies(comment.id)
      }));
  };

  const organizedComments = topLevelComments.map(comment => ({
    ...comment,
    replies: organizeReplies(comment.id)
  }));

  const approvedComments = organizedComments.filter(comment => comment.isApproved);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">
              Comments ({approvedComments.length})
            </h3>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            {showForm ? 'Cancel' : 'Add Comment'}
          </button>
        </div>

        {showForm && (
          <div className="mb-6">
            <CommentForm
              postId={postId}
              onSubmit={async (commentData) => {
                await onAddComment(commentData);
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="space-y-6">
          {approvedComments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            approvedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                onReply={onAddComment}
              />
            ))
          )}
        </div>
      </Card>
    </div>
  );
}