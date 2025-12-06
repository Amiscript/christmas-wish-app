import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-secondary" />
            <span className="text-xl font-serif font-semibold">Christmas Moments</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-serif font-bold text-primary mb-8">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-serif font-semibold text-primary mb-4">Data Collection</h2>
            <p className="text-muted-foreground">
              Christmas Moments collects minimal data to provide our photo-sharing service. We collect:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Photos you upload</li>
              <li>Your name and optional email address</li>
              <li>Post titles, captions, and write-ups</li>
              <li>Likes and comments on posts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-primary mb-4">Data Usage</h2>
            <p className="text-muted-foreground">
              We use your data solely to display your Christmas moments in our public gallery and enable
              community interaction through likes and comments. We never sell or share your personal
              information with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-primary mb-4">Your Rights</h2>
            <p className="text-muted-foreground">
              You have the right to request deletion of your posts at any time. Contact us to exercise
              this right.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-primary mb-4">Cookies</h2>
            <p className="text-muted-foreground">
              We use minimal cookies and local storage to track anonymous likes and improve user
              experience. No tracking or advertising cookies are used.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
