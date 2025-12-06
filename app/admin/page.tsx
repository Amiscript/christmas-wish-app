'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Check, X, Trash2, Eye } from 'lucide-react';
import { Post } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function AdminPage() {
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const [publishedPosts, setPublishedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'published'>('pending');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);

    const { data: pending } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    const { data: published } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(20);

    setPendingPosts(pending || []);
    setPublishedPosts(published || []);
    setLoading(false);
  };

  const handleApprove = async (postId: string) => {
    const { error } = await supabase
      .from('posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .eq('id', postId);

    if (error) {
      toast.error('Failed to approve post');
    } else {
      toast.success('Post approved and published!');
      loadPosts();
    }
  };

  const handleReject = async (postId: string) => {
    const { error } = await supabase
      .from('posts')
      .update({
        status: 'rejected',
        rejection_reason: 'Does not meet community guidelines',
      })
      .eq('id', postId);

    if (error) {
      toast.error('Failed to reject post');
    } else {
      toast.success('Post rejected');
      loadPosts();
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    const { error } = await supabase.from('posts').delete().eq('id', postId);

    if (error) {
      toast.error('Failed to delete post');
    } else {
      toast.success('Post deleted');
      loadPosts();
    }
  };

  const currentPosts = activeTab === 'pending' ? pendingPosts : publishedPosts;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-secondary" />
            <span className="text-xl font-serif font-semibold">Christmas Moments</span>
          </Link>
          <Link href="/gallery">
            <Button variant="outline">View Gallery</Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">
            View Engagements
          </h1>
          <p className="text-muted-foreground">
            Manage and moderate Christmas Moments submissions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Pending</CardTitle>
              <CardDescription>Awaiting moderation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{pendingPosts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Published</CardTitle>
              <CardDescription>Live on the site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{publishedPosts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Posts</CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {pendingPosts.length + publishedPosts.length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'pending' ? 'default' : 'outline'}
            onClick={() => setActiveTab('pending')}
          >
            Pending ({pendingPosts.length})
          </Button>
          <Button
            variant={activeTab === 'published' ? 'default' : 'outline'}
            onClick={() => setActiveTab('published')}
          >
            Published ({publishedPosts.length})
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-32 h-32 bg-muted rounded" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-muted rounded w-1/2" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : currentPosts.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">
                No {activeTab} posts at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {currentPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                     <Image
                      src={post.image_url}
                      alt={post.alt_text}
                      width={128}
                      height={128}
                      className="w-full md:w-32 h-32 object-cover rounded-lg"
                    />

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-serif text-xl font-semibold">{post.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            by {post.author_name} •{' '}
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </div>

                      <p className="text-sm">{post.write_up}</p>

                      <p className="text-sm italic text-muted-foreground">{post.caption}</p>

                      <div className="flex items-center gap-2 pt-2">
                        {post.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(post.id)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(post.id)}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(post.id)}
                          className="ml-auto"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
