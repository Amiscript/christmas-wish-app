# Christmas Moments — by Edison Sime

A warm, professional Next.js web app for sharing Christmas photos, wishes, and love captions with the world.

**Share a photo. Send a wish. Spread joy.**

![Christmas Moments](https://images.pexels.com/photos/1303098/pexels-photo-1303098.jpeg?auto=compress&cs=tinysrgb&w=1200)

## Features

- **Beautiful Photo Gallery**: Responsive masonry grid layout showcasing Christmas moments
- **Easy Upload**: Simple drag-and-drop or camera upload with image preview
- **Love Captions**: Pre-written caption suggestions to make sharing easier
- **Interactive Engagement**: Like and comment on posts to spread the joy
- **Admin Moderation**: Clean dashboard for approving, rejecting, and managing posts
- **Mobile-First Design**: Gorgeous on all devices with thoughtful responsive breakpoints
- **Festive Animations**: Subtle snowfall effect and microinteractions
- **Accessibility-First**: Keyboard navigation, alt text requirements, and high contrast

## Tech Stack

- **Frontend**: Next.js 13 (React), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Styling**: Custom Christmas theme (Evergreen, Warm Gold, Berry Red)
- **Icons**: Lucide React
- **Fonts**: Inter (sans), Playfair Display (serif)
- **Notifications**: Sonner

## Color Palette

- **Primary (Evergreen)**: `hsl(158 85% 22%)` - Deep pine green
- **Secondary (Warm Gold)**: `hsl(43 58% 59%)` - Festive highlight
- **Accent (Berry Red)**: `hsl(0 77% 42%)` - Love accents
- **Background (Ivory)**: `hsl(40 100% 97%)` - Soft ivory
- **Midnight Blue**: `hsl(210 71% 8%)` - Dark contrast

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd christmas-moments
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project at [https://supabase.com](https://supabase.com)
   - The database schema has been created via migrations
   - Get your project URL and anon key from Settings > API

4. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Database Schema

The application uses Supabase with the following tables:

### Posts
- `id`: UUID primary key
- `title`: Post title
- `write_up`: Short description (max 200 chars)
- `caption`: Love caption
- `image_url`: Photo URL (base64 or external)
- `alt_text`: Image description for accessibility
- `author_name`: Author's name
- `author_email`: Optional email
- `likes_count`: Cached like count
- `comments_count`: Cached comment count
- `status`: 'pending', 'published', or 'rejected'
- `created_at`, `published_at`: Timestamps

### Comments
- `id`: UUID primary key
- `post_id`: References posts
- `author_name`: Commenter's name
- `text`: Comment content (max 500 chars)
- `created_at`: Timestamp

### Likes
- `id`: UUID primary key
- `post_id`: References posts
- `session_id`: Anonymous user identifier
- `created_at`: Timestamp

### Profiles (optional)
- `id`: UUID references auth.users
- `name`: Display name
- `email`: Email address
- `role`: 'user', 'admin', or 'moderator'

## Usage

### For Users

1. **View Gallery**: Browse all published Christmas moments
2. **Share a Moment**: Click "Share Your Christmas" to upload
3. **Like & Comment**: Engage with posts you love
4. **Suggested Captions**: Use pre-written captions or write your own

### For Admins

1. Navigate to `/admin` to access the moderation dashboard
2. Review pending posts
3. Approve or reject submissions
4. Delete inappropriate content
5. View statistics

## Content Guidelines

Christmas Moments welcomes warm, family-friendly content:

- Keep it festive and joyful
- No hate speech, harassment, or discrimination
- Respect copyright and intellectual property
- Appropriate for all ages
- Maximum 200 characters for write-ups

## Accessibility

- All images require descriptive alt text
- Keyboard navigation supported throughout
- High color contrast ratios (WCAG AA compliant)
- Screen reader friendly
- Focus states on all interactive elements

## Moderation Policy

We welcome warm, family-friendly content. Posts containing hate speech, nudity, harassment, or other inappropriate content will be removed. Rejected posts are accompanied by a notification explaining why.

## Pre-Written Captions

The app includes 20+ love captions and wishes:

**Short Captions:**
- "Wrapped in your love."
- "Love, lights, and laughter."
- "Merry everything, and a happy always."

**Long Wishes:**
- "May your holidays be full of warmth, laughter, and the kind of moments you tuck into your heart forever. Merry Christmas!"
- "Wishing you cozy nights, bright mornings, and a year ahead wrapped in love."

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js static exports or server-side rendering.

## Future Enhancements

- Email notifications (Nodemailer integration)
- Social media sharing optimization
- E-card generation and email sending
- Advanced search and filtering
- User accounts and profiles
- Photo editing and filters
- Cloudinary integration for image optimization
- Analytics dashboard
- Mobile app (React Native)

## License

Built with love by Edison Sime.

## Support

For questions or support, please create an issue in the repository.

---

**Christmas Moments** — Share a photo. Send a wish. Spread joy.
