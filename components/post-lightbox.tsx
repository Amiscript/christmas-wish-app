'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Share2, X, Send } from 'lucide-react';
import { Post, Comment } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface PostLightboxProps {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export function PostLightbox({ post, open, onOpenChange, onUpdate }: PostLightboxProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ name: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (post) {
      setLikesCount(post.likes_count);
      loadComments();
      checkIfLiked();
    }
  }, [post]);

  const loadComments = async () => {
    if (!post) return;

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', post.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading comments:', error);
    } else {
      setComments(data || []);
    }
  };

  const checkIfLiked = async () => {
    if (!post) return;

    const sessionId = getSessionId();
    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', post.id)
      .eq('session_id', sessionId)
      .maybeSingle();

    setIsLiked(!!data);
  };

  const handleLike = async () => {
    if (!post) return;

    try {
      const sessionId = getSessionId();

      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', post.id)
          .eq('session_id', sessionId);

        if (error) throw error;

        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        const { error } = await supabase.from('likes').insert({
          post_id: post.id,
          session_id: sessionId,
        });

        if (error) throw error;

        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }

      onUpdate?.();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!post || !newComment.name.trim() || !newComment.text.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('comments').insert({
        post_id: post.id,
        author_name: newComment.name,
        text: newComment.text,
      });

      if (error) throw error;

      toast.success('Comment added!');
      setNewComment({ name: '', text: '' });
      loadComments();
      onUpdate?.();
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (!post) return;

    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.caption,
        url: window.location.origin + '/posts/' + post.id,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + '/posts/' + post.id);
      toast.success('Link copied to clipboard!');
    }
  };

  const getSessionId = () => {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  };

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden">
        <div className="grid md:grid-cols-2 h-full">
          <div className="relative bg-midnight-blue flex items-center justify-center">
            <img
              src={post.image_url}
              alt={post.alt_text}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-col h-full max-h-[90vh]">
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-serif font-semibold text-card-foreground">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    by {post.author_name} • {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-card-foreground leading-relaxed">
                {post.write_up}
              </p>

              <div className="mt-4 p-4 bg-accent/10 rounded-lg border-l-4 border-accent">
                <p className="text-lg italic text-accent-foreground font-serif">
                  "{post.caption}"
                </p>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <Button
                  variant={isLiked ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleLike}
                  className="gap-2"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  {likesCount}
                </Button>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{comments.length}</span>
                </div>

                <Button variant="ghost" size="sm" onClick={handleShare} className="ml-auto gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <h3 className="font-semibold text-lg">Comments</h3>

              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-sm">{comment.author_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-card-foreground">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitComment} className="p-6 border-t bg-card">
              <div className="space-y-3">
                <Input
                  placeholder="Your name"
                  value={newComment.name}
                  onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                  required
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment.text}
                    onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                    required
                  />
                  <Button type="submit" disabled={isSubmitting} size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
