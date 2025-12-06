'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Camera, Filter } from 'lucide-react';
import { Snowfall } from '@/components/snowfall';
import { UploadModal } from '@/components/upload-modal';
import { PostCard } from '@/components/post-card';
import { PostLightbox } from '@/components/post-lightbox';
import { Post } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

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
    <div className="min-h-screen">
      <Snowfall />

      <nav className="relative z-10 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-secondary" />
            <span className="text-xl font-serif font-semibold">Christmas Moments </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">View Engagement</Button>
            </Link>
            <Button
              onClick={() => setUploadModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Camera className="w-4 h-4 mr-2" />
              Share Your Christmas
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Christmas Moments Gallery
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the warmth, love, and joy shared by our community
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-md animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="flex gap-4 pt-2">
                    <div className="h-4 bg-muted rounded w-16" />
                    <div className="h-4 bg-muted rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <Camera className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
              No posts yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Be the first to share some Christmas love!
            </p>
            <Button
              size="lg"
              onClick={() => setUploadModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Camera className="w-5 h-5 mr-2" />
              Share Your Christmas
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
