# Christmas Moments - Setup Guide

This guide will walk you through setting up Christmas Moments from scratch.

## Step 1: Set Up Supabase

### Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up or log in
2. Click "New Project"
3. Choose an organization or create one
4. Fill in your project details:
   - **Name**: Christmas Moments
   - **Database Password**: Choose a strong password
   - **Region**: Choose the closest region to your users
5. Click "Create new project" and wait for it to initialize

### Run the Database Migration

The database schema has already been created via the Supabase migration. The schema includes:
- `posts` table for Christmas moments
- `comments` table for post comments
- `likes` table for tracking likes
- `profiles` table for user profiles
- `moderation_log` table for admin actions

All tables have Row Level Security (RLS) enabled with appropriate policies.

### Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (the long string under "Project API keys")

## Step 2: Configure the Application

### Create Environment File

1. In your project root, copy the example file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Install and Run

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Your app should now be running at [http://localhost:3000](http://localhost:3000)

## Step 4: Test the Application

### Upload Your First Post

1. Click "Share Your Christmas" button
2. Upload a photo (max 5MB)
3. Fill in the title, write-up, caption, and alt text
4. Use suggested captions or write your own
5. Submit

### Access Admin Dashboard

1. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)
2. You'll see your pending post
3. Click "Approve" to publish it
4. Return to the homepage to see it in the gallery

### Test Interactions

1. Click on a post to open the lightbox
2. Like the post (click the heart)
3. Add a comment
4. Share the post

## Step 5: Customize (Optional)

### Change Colors

Edit `app/globals.css` to customize the Christmas theme colors:

```css
:root {
  --evergreen: 158 85% 22%;      /* Deep pine green */
  --warm-gold: 43 58% 59%;       /* Festive gold */
  --berry-red: 0 77% 42%;        /* Berry red */
  --ivory: 40 100% 97%;          /* Soft ivory */
  --midnight-blue: 210 71% 8%;   /* Midnight blue */
}
```

### Add Your Own Captions

Edit `lib/captions.ts` to add or modify suggested captions and wishes.

### Configure Auto-Publishing

By default, posts are auto-published. To require manual approval:

In `components/upload-modal.tsx`, change:
```typescript
status: 'published',
```
to:
```typescript
status: 'pending',
```

## Step 6: Deploy to Production

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Option 2: Other Platforms

Christmas Moments can be deployed to:
- Netlify
- AWS Amplify
- Render
- Railway
- Any platform supporting Next.js

## Troubleshooting

### Images Not Displaying

If images are not displaying, ensure:
1. Your Supabase URL is correct in `.env.local`
2. The URL starts with `https://`
3. You're using base64 data URLs for images (current implementation)

### Posts Not Loading

Check:
1. Browser console for errors
2. Supabase dashboard > Table Editor to verify data exists
3. RLS policies are correctly configured
4. Your anon key is correct

### Build Errors

If you get build errors:
1. Delete `.next` folder: `rm -rf .next`
2. Clear node modules: `rm -rf node_modules`
3. Reinstall: `npm install`
4. Rebuild: `npm run build`

### Database Connection Issues

Verify:
1. Your Supabase project is active (not paused)
2. Environment variables are correctly set
3. You're using the correct project URL and anon key
4. Network/firewall isn't blocking Supabase requests

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. Use Row Level Security (RLS) for all tables (already configured)
3. Validate user input on the client and server
4. Keep your Supabase service role key private
5. Enable Supabase email confirmation for user signups (if using auth)
6. Regularly review admin dashboard for inappropriate content

## Production Checklist

Before going live:

- [ ] Environment variables configured correctly
- [ ] Database migrations applied
- [ ] RLS policies tested
- [ ] Content moderation workflow established
- [ ] Privacy and Terms pages customized
- [ ] Social media sharing tested
- [ ] Mobile responsiveness verified
- [ ] Accessibility audit completed
- [ ] Analytics configured (optional)
- [ ] Backup strategy in place

## Support

For issues or questions:
- Check the README.md
- Review Supabase documentation
- Open an issue on GitHub

---

Built with love by Edison Sime. Merry Christmas!
