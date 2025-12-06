'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { Camera, Upload, X, Sparkles } from 'lucide-react';
import { shortCaptions, writeUpSuggestions } from '@/lib/captions';
import { toast } from 'sonner';

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UploadModal({ open, onOpenChange, onSuccess }: UploadModalProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    writeUp: '',
    caption: '',
    imageUrl: '',
    altText: '',
    authorName: '',
    authorEmail: '',
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl || !formData.title || !formData.writeUp || !formData.caption || !formData.authorName || !formData.altText) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.writeUp.length > 200) {
      toast.error('Write-up must be 200 characters or less');
      return;
    }

    setUploading(true);

    try {
      const { error } = await supabase.from('posts').insert({
        title: formData.title,
        write_up: formData.writeUp,
        caption: formData.caption,
        image_url: formData.imageUrl,
        alt_text: formData.altText,
        author_name: formData.authorName,
        author_email: formData.authorEmail || null,
        status: 'published',
      });

      if (error) throw error;

      toast.success('Thank you — your moment is being prepared for the gallery!');
      onOpenChange(false);
      resetForm();
      onSuccess?.();
    } catch (error) {
      console.error('Error uploading post:', error);
      toast.error('Failed to upload your moment. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      writeUp: '',
      caption: '',
      imageUrl: '',
      altText: '',
      authorName: '',
      authorEmail: '',
    });
    setPreview('');
  };

  const insertCaption = (caption: string) => {
    setFormData({ ...formData, caption });
  };

  const insertWriteUp = (writeUp: string) => {
    setFormData({ ...formData, writeUp });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-primary flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-secondary" />
            Share Your Christmas Moment
          </DialogTitle>
          <DialogDescription>
            Upload a photo, add a short message, and spread warmth across the gallery.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!preview ? (
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Camera className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Choose a photo</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or drag and drop here
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Max 5MB • Portrait photos look great!
                    </p>
                  </div>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden">
              <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
              <button
                type="button"
                onClick={() => {
                  setPreview('');
                  setFormData({ ...formData, imageUrl: '' });
                }}
                className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Christmas Morning Magic"
                maxLength={100}
                required
              />
            </div>

            <div>
              <Label htmlFor="writeUp">
                Write-up * ({formData.writeUp.length}/200)
              </Label>
              <Textarea
                id="writeUp"
                value={formData.writeUp}
                onChange={(e) => setFormData({ ...formData, writeUp: e.target.value })}
                placeholder="Share your Christmas moment..."
                maxLength={200}
                rows={3}
                required
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {writeUpSuggestions.slice(0, 3).map((suggestion, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => insertWriteUp(suggestion)}
                    className="text-xs px-2 py-1 bg-secondary/20 hover:bg-secondary/30 rounded-full transition-colors"
                  >
                    {suggestion.slice(0, 30)}...
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="caption">Love Caption *</Label>
              <Input
                id="caption"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="e.g., Love, lights, and laughter."
                maxLength={100}
                required
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {shortCaptions.slice(0, 5).map((caption, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => insertCaption(caption)}
                    className="text-xs px-2 py-1 bg-secondary/20 hover:bg-secondary/30 rounded-full transition-colors"
                  >
                    {caption}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="altText">Image Description (for accessibility) *</Label>
              <Input
                id="altText"
                value={formData.altText}
                onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                placeholder="Describe what's in the photo"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="authorName">Your Name *</Label>
                <Input
                  id="authorName"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="e.g., Sarah"
                  required
                />
              </div>

              <div>
                <Label htmlFor="authorEmail">Email (optional)</Label>
                <Input
                  id="authorEmail"
                  type="email"
                  value={formData.authorEmail}
                  onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={uploading}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {uploading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Share Your Moment
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
