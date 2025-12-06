'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Post } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  onClick: () => void;
  onLikeChange?: () => void;
}

export function PostCard({ post, onClick, onLikeChange }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isLiking) return;
    setIsLiking(true);

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

        triggerConfetti(e.currentTarget as HTMLElement);
      }

      onLikeChange?.();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    } finally {
      setIsLiking(false);
    }
  };

  const triggerConfetti = (element: HTMLElement) => {
    const colors = ['#DCAE4E', '#B91C1C', '#0B6E4F'];
    const confettiCount = 10;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'absolute';
      confetti.style.width = '8px';
      confetti.style.height = '8px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = '50%';
      confetti.style.pointerEvents = 'none';
      confetti.className = 'confetti';

      const rect = element.getBoundingClientRect();
      confetti.style.left = `${rect.left + rect.width / 2}px`;
      confetti.style.top = `${rect.top + rect.height / 2}px`;

      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 1000);
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

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={post.image_url}
          alt={post.alt_text}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-serif text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {post.write_up}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-medium">{post.author_name}</span>
          <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1.5 transition-colors ${
              isLiked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current like-animation' : ''}`} />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{post.comments_count}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(window.location.origin + '/posts/' + post.id);
              toast.success('Link copied!');
            }}
            className="ml-auto text-muted-foreground hover:text-primary transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
