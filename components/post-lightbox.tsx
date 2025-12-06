'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

    const shareText = `${post.title}\n${post.caption}\n\nView this post and more on our website!`;

    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: shareText,
        url: window.location.origin, // Redirects to home page
      });
    } else {
      navigator.clipboard.writeText(window.location.origin); // Copy home page URL
      toast.success('Home page link copied to clipboard!');
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
      <DialogContent className="max-w-5xl p-0 md:rounded-lg">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-2 h-[90vh]">
          <div className="relative bg-midnight-blue flex items-center justify-center">
            <Image
              src={post.image_url}
              alt={post.alt_text}
              width={800}
              height={600}
              className="w-full h-full object-contain p-4"
              priority
            />
          </div>

          <div className="flex flex-col h-full">
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
                  {post.caption}
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

        {/* Mobile Layout - Full Screen Scrollable */}
        <div className="md:hidden h-screen w-screen bg-background overflow-y-auto">
          {/* Fixed Header */}
          <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-10 w-10"
            >
              <X className="w-5 h-5" />
            </Button>
            <h2 className="font-semibold text-lg truncate max-w-[70%]">{post.title}</h2>
            <div className="w-10"></div> {/* Spacer for balance */}
          </div>

          {/* Scrollable Content */}
          <div className="px-4 pb-24">
            {/* Image */}
            <div className="relative bg-midnight-blue rounded-lg my-4 flex items-center justify-center min-h-[300px]">
              <Image
                src={post.image_url}
                alt={post.alt_text}
                width={800}
                height={600}
                className="w-full h-full object-contain p-4"
                priority
              />
            </div>

            {/* Post Info */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">
                  by {post.author_name}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </span>
              </div>

              <p className="text-card-foreground leading-relaxed mb-4">
                {post.write_up}
              </p>

              <div className="p-4 bg-accent/10 rounded-lg border-l-4 border-accent mb-4">
                <p className="text-lg italic text-accent-foreground font-serif">
                  {post.caption}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 py-3 border-y">
                <Button
                  variant={isLiked ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleLike}
                  className="gap-2 flex-1"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  {likesCount}
                </Button>

                <div className="flex items-center gap-2 text-muted-foreground px-3">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{comments.length}</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2 flex-1"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">Comments</h3>

              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="space-y-1 pb-4 border-b last:border-0 last:pb-0">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                        <span className="font-medium text-sm">{comment.author_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-card-foreground mt-1">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Fixed Comment Form at Bottom */}
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 shadow-lg">
            <form onSubmit={handleSubmitComment}>
              <div className="space-y-3">
                <Input
                  placeholder="Your name"
                  value={newComment.name}
                  onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                  required
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment.text}
                    onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                    required
                    className="text-sm flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="icon"
                    className="flex-shrink-0"
                  >
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