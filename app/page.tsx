'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Camera, ArrowRight } from 'lucide-react';
import { Snowfall } from '@/components/snowfall';
import { UploadModal } from '@/components/upload-modal';
import { PostCard } from '@/components/post-card';
import { PostLightbox } from '@/components/post-lightbox';
import { Post } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Home() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    loadFeaturedPosts();
  }, []);

  const loadFeaturedPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(6);

    if (!error && data) {
      setFeaturedPosts(data);
    }
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
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-secondary" />
            <span className="text-xl font-serif font-semibold">Christmas Moments</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/gallery">
              <Button variant="ghost">Gallery</Button>
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

      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full text-sm font-medium text-secondary-foreground mb-4">
              <Sparkles className="w-4 h-4" />
             I Love You and There is Nothing You Can Do About It❤️!Edison sime
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary leading-tight">
             Celebrating Christmas and Welcoming the New Year  Share Your Christmas Moments
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Love, Joy & Wishes
            </p>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a photo, write a short wish, and let the world feel your holiday spirit.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => setUploadModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
              >
                <Camera className="w-5 h-5 mr-2" />
                Share Your Christmas
              </Button>

              <Link href="/gallery">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 w-full sm:w-auto">
                  View Gallery
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Memories  under the lights
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Little moments, big Christmas feeling.
            </p>
          </div>

          {featuredPosts.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-xl text-muted-foreground mb-2">
                No posts yet — be the first to share some Christmas love!
              </p>
              <Button
                onClick={() => setUploadModalOpen(true)}
                variant="outline"
                className="mt-4"
              >
                <Camera className="w-4 h-4 mr-2" />
                Share Your Moment
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={() => handlePostClick(post)}
                    onLikeChange={loadFeaturedPosts}
                  />
                ))}
              </div>

              <div className="text-center">
                <Link href="/gallery">
                  <Button variant="outline" size="lg">
                    View All Moments
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Ready to Share Your Joy?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join our community in spreading Christmas cheer. Upload your special moment and touch hearts around the world.
          </p>
          <Button
            size="lg"
            onClick={() => setUploadModalOpen(true)}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            <Camera className="w-5 h-5 mr-2" />
            Share Your Christmas
          </Button>
        </div>
      </section>

      <footer className="py-8 border-t bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span className="font-serif font-semibold">Christmas Moments</span>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Built with <Heart className="w-4 h-4 inline text-destructive fill-current" /> by Edison Sime
            </p>

            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <UploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onSuccess={loadFeaturedPosts}
      />

      <PostLightbox
        post={selectedPost}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        onUpdate={loadFeaturedPosts}
      />
    </div>
  );
}
