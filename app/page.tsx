'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Camera, ArrowRight, Moon, Sun,  Gift } from 'lucide-react';
import { Snowfall } from '@/components/snowfall';
import { UploadModal } from '@/components/upload-modal';
import { PostCard } from '@/components/post-card';
import { PostLightbox } from '@/components/post-lightbox';
import { Post } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export default function Home() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { theme, setTheme } = useTheme();

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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10 transition-all duration-300">
      <Snowfall />

      {/* Navigation */}
      <nav className="relative z-10 border-b bg-card/80 dark:bg-card/90 backdrop-blur-sm dark:border-primary/20 sticky top-0 transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30 animate-pulse"></div>
              <Sparkles className="relative w-7 h-7 text-primary dark:text-secondary" />
            </div>
            <span className="text-2xl font-serif font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Christmas Moments
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full hover:bg-primary/10 dark:hover:bg-primary/20"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-amber-400" />
              ) : (
                <Moon className="h-5 w-5 text-primary" />
              )}
            </Button>

            {/* Navigation Links */}
         
            <Link href="/gallery">
              <Button variant="ghost" className="gap-2">
                <Camera className="w-4 h-4" />
                Gallery
              </Button>
            </Link>

            {/* Game Links Container */}
            <div className="hidden md:flex items-center gap-2 ml-2 border-l border-border pl-4">
              <Link href="/games">
                <Button variant="ghost" size="sm" className="gap-2 bg-gradient-to-r from-primary/10 to-secondary/10">
                  <Gift className="w-4 h-4" />
                  Memory Match
                </Button>
              </Link>

              <Link href="/word-challenge">
                <Button variant="ghost" size="sm" className="gap-2 bg-gradient-to-r from-primary/10 to-secondary/10">
                  {/* <ChristmasTree className="w-4 h-4" /> */}
                  Word Challenge
                </Button>
              </Link>
            </div>

            {/* Upload Button */}
            <Button
              onClick={() => setUploadModalOpen(true)}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Camera className="w-4 h-4 mr-2" />
              Share Your Christmas
            </Button>
          </div>
        </div>

        {/* Mobile Game Links */}
        <div className="md:hidden container mx-auto px-4 py-3 border-t border-border/50 dark:border-primary/20">
          <div className="flex justify-center gap-4">
            <Link href="/games">
              <Button variant="ghost" size="sm" className="gap-2">
                <Gift className="w-4 h-4" />
                Memory Match
              </Button>
            </Link>
            <Link href="/word-challenge">
              <Button variant="ghost" size="sm" className="gap-2">
                {/* <ChristmasTree className="w-4 h-4" /> */}
                Word Challenge
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent dark:from-primary/5 dark:via-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 rounded-full border border-primary/30 dark:border-primary/50 backdrop-blur-sm animate-fade-in">
              <Sparkles className="w-5 h-5 text-primary dark:text-secondary animate-spin-slow" />
              <span className="font-medium text-primary-foreground dark:text-secondary-foreground">
                I Love You and There is Nothing You Can Do About It ❤️ <span className='bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient'>! Edison Sime</span>
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
                  Celebrating Christmas
                </span>
                <br />
                <span className="text-foreground dark:text-primary-foreground mt-2 block">
                  & Welcoming the New Year 
               
                </span>
              </h1>

              <div className="h-1 w-32 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>

              <p className="text-2xl md:text-3xl font-light text-muted-foreground dark:text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
                Share Your Christmas Moments, Spread Love, Joy & Wishes with Edison sime
              </p>

              <p className="text-lg text-muted-foreground dark:text-primary-foreground/60 max-w-2xl mx-auto">
                Upload a photo, write a heartfelt wish, and let the world feel your Christmas spirit.
                Every moment shared adds warmth to someone Christmas.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
              <Button
                size="lg"
                onClick={() => setUploadModalOpen(true)}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white text-lg px-10 py-7 rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 group"
              >
                <Camera className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                Share Your Christmas
              </Button>

              <Link href="/gallery">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-10 py-7 rounded-xl border-2 dark:border-primary/30 hover:border-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300 group"
                >
                  Explore Gallery
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent"></div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-20 bg-gradient-to-b from-card/30 to-background dark:from-card/20 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Memories Under the Lights
              </h2>
              <div className="w-3 h-3 bg-secondary rounded-full animate-pulse delay-300"></div>
            </div>
            <p className="text-xl text-muted-foreground dark:text-primary-foreground/70 max-w-2xl mx-auto">
              Little moments that create the big Christmas feeling
            </p>
          </div>

          {featuredPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative inline-block mb-6">
                <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl"></div>
                <Heart className="relative w-20 h-20 text-primary/50 dark:text-secondary/50 animate-pulse" />
              </div>
              <p className="text-2xl font-light text-muted-foreground dark:text-primary-foreground/80 mb-3">
                No posts yet — be the first to share some Christmas love!
              </p>
              <p className="text-muted-foreground dark:text-primary-foreground/60 mb-8">
                Your moment could be the one that starts it all
              </p>
              <Button
                onClick={() => setUploadModalOpen(true)}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-6 rounded-xl"
              >
                <Camera className="w-5 h-5 mr-3" />
                Share Your First Moment
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredPosts.map((post) => (
                  <div 
                    key={post.id}
                    className="transform hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl rounded-2xl overflow-hidden"
                  >
                    <PostCard
                      post={post}
                      onClick={() => handlePostClick(post)}
                      onLikeChange={loadFeaturedPosts}
                    />
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link href="/gallery">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="rounded-xl border-2 px-10 py-6 text-lg group hover:bg-primary/10 dark:hover:bg-primary/20"
                  >
                    View All Magical Moments
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-secondary dark:from-primary/90 dark:via-primary/80 dark:to-secondary/90"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Ready to Share Your Joy?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Join our community in spreading Christmas cheer. Upload your special moment and touch hearts around the world. Every shared memory creates a ripple of happiness.
            </p>
            <Button
              size="lg"
              onClick={() => setUploadModalOpen(true)}
              className="bg-white hover:bg-white/90 text-primary text-lg px-12 py-7 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
            >
              <Camera className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
              Share Your Christmas Magic
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t bg-card/50 dark:bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30"></div>
                <Sparkles className="relative w-6 h-6 text-primary dark:text-secondary" />
              </div>
              <span className="text-xl font-serif font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Christmas Moments
              </span>
            </div>

            <p className="text-sm text-muted-foreground dark:text-primary-foreground/70 text-center">
              Built with{' '}
              <Heart className="w-4 h-4 inline text-destructive fill-current animate-pulse" />
              {' '}by Edison Sime • Bringing holiday magic to life
            </p>

            <div className="flex gap-6 text-sm">
              <Link 
                href="/privacy" 
                className="text-muted-foreground dark:text-primary-foreground/70 hover:text-primary dark:hover:text-secondary transition-colors"
              >
                Privacy
              </Link>
              <Link 
                href="/terms" 
                className="text-muted-foreground dark:text-primary-foreground/70 hover:text-primary dark:hover:text-secondary transition-colors"
              >
                Terms
              </Link>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-muted-foreground dark:text-primary-foreground/70 hover:text-primary dark:hover:text-secondary transition-colors"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
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