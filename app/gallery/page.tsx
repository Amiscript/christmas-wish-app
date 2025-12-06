'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Camera, Filter, Gift, TreePine } from 'lucide-react';
import { Snowfall } from '@/components/snowfall';
import { UploadModal } from '@/components/upload-modal';
import { PostCard } from '@/components/post-card';
import { PostLightbox } from '@/components/post-lightbox';
import { Post } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function GalleryPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Snowfall />

      {/* Floating Christmas Elements - Hidden on mobile to reduce clutter */}
      <div className="hidden lg:block">
        <div className="fixed left-4 bottom-24 z-20 animate-bounce-slow">
          <TreePine className="w-12 h-12 text-emerald-600" />
        </div>
        <div className="fixed right-6 top-1/4 z-20 animate-bounce-delayed">
          <Gift className="w-10 h-10 text-red-500" />
        </div>
        <div className="fixed right-10 bottom-32 z-20 animate-bounce">
          <Gift className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <nav className="relative z-10 border-b bg-card/95 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
            <span className="text-lg sm:text-xl font-serif font-semibold truncate max-w-[150px] sm:max-w-none">
              Christmas Moments
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/admin">
              <Button 
                variant="ghost" 
                size="sm"
                className="hidden xs:inline-flex text-xs sm:text-sm"
              >
                View Engagement
              </Button>
            </Link>
            <Button
              onClick={() => setUploadModalOpen(true)}
              className="bg-primary hover:bg-primary/90 h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm"
            >
              <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Share Your Christmas</span>
              <span className="xs:hidden">Share</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mb-3 sm:mb-4 px-2">
            Christmas Moments Gallery
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Explore the warmth, love, and joy shared by our community
          </p>
          
          {/* Mobile-only decorative elements */}
          <div className="flex justify-center gap-4 mt-4 sm:hidden">
            <TreePine className="w-6 h-6 text-emerald-600" />
            <Gift className="w-5 h-5 text-red-500" />
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl sm:rounded-2xl overflow-hidden shadow-sm sm:shadow-md animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="h-4 sm:h-6 bg-muted rounded" />
                  <div className="h-3 sm:h-4 bg-muted rounded w-3/4" />
                  <div className="flex gap-3 sm:gap-4 pt-1 sm:pt-2">
                    <div className="h-3 sm:h-4 bg-muted rounded w-12 sm:w-16" />
                    <div className="h-3 sm:h-4 bg-muted rounded w-12 sm:w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <Camera className="w-16 h-16 sm:w-20 sm:h-20 text-muted-foreground mx-auto mb-4 sm:mb-6 opacity-50" />
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground mb-2">
              No posts yet
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-4">
              Be the first to share some Christmas love!
            </p>
            <Button
              size="lg"
              onClick={() => setUploadModalOpen(true)}
              className="bg-primary hover:bg-primary/90 h-11 sm:h-12 px-6"
            >
              <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Share Your Christmas
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => handlePostClick(post)}
                onLikeChange={loadPosts}
              />
            ))}
          </div>
        )}
      </div>

      <UploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onSuccess={loadPosts}
      />

      <PostLightbox
        post={selectedPost}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        onUpdate={loadPosts}
      />
    </div>
  );
}