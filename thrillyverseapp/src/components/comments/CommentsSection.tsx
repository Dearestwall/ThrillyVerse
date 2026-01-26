// src/components/comments/CommentsSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { MessageSquare, Send, ThumbsUp, Reply, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  likes: number;
  replies: Comment[];
  createdAt: string;
  isLiked?: boolean;
}

interface CommentsSectionProps {
  resourceId: string;
  resourceType: 'project' | 'material' | 'quiz';
}

export function CommentsSection({ resourceId, resourceType }: CommentsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch comments from Firestore
    const mockComments: Comment[] = [
      {
        id: '1',
        userId: '123',
        userName: 'John Doe',
        content: 'This is really helpful! Thanks for sharing.',
        likes: 12,
        replies: [
          {
            id: '1-1',
            userId: '456',
            userName: 'Jane Smith',
            content: 'I agree! Very useful material.',
            likes: 3,
            replies: [],
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
        ],
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        userId: '789',
        userName: 'Mike Johnson',
        content: 'Can you add more examples on this topic?',
        likes: 5,
        replies: [],
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
    ];
    setComments(mockComments);
  }, [resourceId, resourceType]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return;

    setLoading(true);
    try {
      // TODO: Add comment to Firestore
      const comment: Comment = {
        id: Date.now().toString(),
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || undefined,
        content: newComment,
        likes: 0,
        replies: [],
        createdAt: new Date().toISOString(),
      };

      setComments([comment, ...comments]);
      setNewComment('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (commentId: string) => {
    // TODO: Implement like functionality
    setComments(
      comments.map((c) =>
        c.id === commentId ? { ...c, likes: c.likes + 1, isLiked: true } : c
      )
    );
  };

  const handleDelete = (commentId: string) => {
    // TODO: Implement delete functionality
    setComments(comments.filter((c) => c.id !== commentId));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div
      key={comment.id}
      className={`${isReply ? 'ml-12 mt-4' : 'mb-6'} bg-white rounded-lg p-4 shadow-sm`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
          {comment.userName[0]}
        </div>

        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900">{comment.userName}</span>
            <span className="text-xs text-gray-500">{formatTime(comment.createdAt)}</span>
          </div>

          {/* Content */}
          <p className="text-gray-700 mb-3">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(comment.id)}
              className={`flex items-center gap-1 text-sm ${
                comment.isLiked ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${comment.isLiked ? 'fill-indigo-600' : ''}`} />
              <span>{comment.likes}</span>
            </button>

            <button
              onClick={() => setReplyTo(comment.id)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600"
            >
              <Reply className="w-4 h-4" />
              <span>Reply</span>
            </button>

            {user && user.uid === comment.userId && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}
          </div>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Add Comment */}
      {user ? (
        <div className="bg-white rounded-lg p-4 shadow-lg mb-8">
          <div className="flex gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
              {user.displayName?.[0] || 'U'}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 text-center">
          <p className="text-gray-600 mb-4">Please log in to comment</p>
          <Link
            href="/login"
            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div>
        {comments.length > 0 ? (
          comments.map((comment) => renderComment(comment))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}