import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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

        <h1 className="text-4xl font-serif font-bold text-primary mb-8">Terms of Service</h1>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-serif font-semibold text-primary mb-4">Content Guidelines</h2>
            <p className="text-muted-foreground">
              Christmas Moments welcomes warm, family-friendly content. By uploading to our platform,
              you agree that your content:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Is appropriate for all ages</li>
              <li>Does not contain hate speech, harassment, or discrimination</li>
              <li>Does not violate copyright or intellectual property rights</li>
              <li>Respects the privacy of others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-primary mb-4">Moderation</h2>
            <p className="text-muted-foreground">
              We reserve the right to review, moderate, and remove content that violates these
              guidelines. Posts that are rejected will be accompanied by a notification explaining why.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-primary mb-4">Content Rights</h2>
            <p className="text-muted-foreground">
              You retain all rights to the content you upload. By posting, you grant Christmas Moments
              a license to display your content on our platform and in promotional materials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-primary mb-4">User Conduct</h2>
            <p className="text-muted-foreground">
              Users agree to engage respectfully in comments and interactions. Spam, harassment, or
              abusive behavior will result in content removal and potential account restrictions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-primary mb-4">Liability</h2>
            <p className="text-muted-foreground">
              Christmas Moments is provided as-is. We are not liable for user-generated content or
              any damages arising from the use of our service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
