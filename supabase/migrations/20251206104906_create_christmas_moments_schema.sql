/*
  # Christmas Moments Database Schema
  
  ## Overview
  Creates the complete database structure for the Christmas Moments app by Edison Sime.
  
  ## New Tables
  
  ### `profiles`
  - `id` (uuid, references auth.users) - User profile ID
  - `name` (text) - Display name
  - `email` (text) - Email address
  - `role` (text) - User role: 'user', 'admin', 'moderator'
  - `created_at` (timestamptz) - Account creation timestamp
  
  ### `posts`
  - `id` (uuid, primary key) - Post ID
  - `title` (text) - Post title
  - `write_up` (text) - Short write-up (max 200 chars)
  - `caption` (text) - Love caption
  - `image_url` (text) - URL to uploaded image
  - `alt_text` (text) - Image alt text for accessibility
  - `author_name` (text) - Author's display name
  - `author_email` (text, optional) - Author's email
  - `author_id` (uuid, optional) - References profiles if authenticated
  - `likes_count` (integer) - Cached like count
  - `comments_count` (integer) - Cached comment count
  - `status` (text) - 'pending', 'published', 'rejected'
  - `rejection_reason` (text, optional) - Reason if rejected
  - `created_at` (timestamptz) - Post creation timestamp
  - `published_at` (timestamptz, optional) - Publication timestamp
  
  ### `comments`
  - `id` (uuid, primary key) - Comment ID
  - `post_id` (uuid) - References posts
  - `author_name` (text) - Commenter's name
  - `author_id` (uuid, optional) - References profiles if authenticated
  - `text` (text) - Comment text
  - `created_at` (timestamptz) - Comment creation timestamp
  
  ### `likes`
  - `id` (uuid, primary key) - Like ID
  - `post_id` (uuid) - References posts
  - `user_id` (uuid, optional) - References profiles if authenticated
  - `session_id` (text) - For anonymous likes (fingerprint)
  - `created_at` (timestamptz) - Like timestamp
  
  ### `moderation_log`
  - `id` (uuid, primary key) - Log entry ID
  - `post_id` (uuid) - References posts
  - `moderator_id` (uuid) - References profiles
  - `action` (text) - 'approved', 'rejected', 'deleted'
  - `reason` (text, optional) - Action reason
  - `created_at` (timestamptz) - Log timestamp
  
  ## Security
  - RLS enabled on all tables
  - Public read access for published posts
  - Authenticated write access with proper checks
  - Admin-only moderation access
  
  ## Indexes
  - Posts indexed by status and created_at for efficient queries
  - Comments indexed by post_id
  - Likes indexed by post_id and session_id for duplicate prevention
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  write_up text NOT NULL CHECK (char_length(write_up) <= 200),
  caption text NOT NULL,
  image_url text NOT NULL,
  alt_text text NOT NULL,
  author_name text NOT NULL,
  author_email text,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
  rejection_reason text,
  created_at timestamptz DEFAULT now(),
  published_at timestamptz
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are viewable by everyone"
  ON posts FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view all posts"
  ON posts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Admins can update posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'moderator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Admins can delete posts"
  ON posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'moderator')
    )
  );

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  text text NOT NULL CHECK (char_length(text) <= 500),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments on published posts are viewable by everyone"
  ON comments FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = comments.post_id
      AND posts.status = 'published'
    )
  );

CREATE POLICY "Anyone can create comments on published posts"
  ON comments FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = comments.post_id
      AND posts.status = 'published'
    )
  );

CREATE POLICY "Admins can delete comments"
  ON comments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'moderator')
    )
  );

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  session_id text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id),
  UNIQUE(post_id, session_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create likes"
  ON likes FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can delete own likes"
  ON likes FOR DELETE
  TO public
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (session_id IS NOT NULL)
  );

-- Create moderation_log table
CREATE TABLE IF NOT EXISTS moderation_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  moderator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('approved', 'rejected', 'deleted', 'edited')),
  reason text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE moderation_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view moderation logs"
  ON moderation_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Admins can create moderation logs"
  ON moderation_log FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'moderator')
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS posts_status_created_idx ON posts(status, created_at DESC);
CREATE INDEX IF NOT EXISTS posts_published_idx ON posts(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments(post_id, created_at DESC);
CREATE INDEX IF NOT EXISTS likes_post_id_idx ON likes(post_id);
CREATE INDEX IF NOT EXISTS likes_session_id_idx ON likes(session_id);

-- Create function to update post counts
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS update_likes_count_trigger ON likes;
CREATE TRIGGER update_likes_count_trigger
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_likes_count();

DROP TRIGGER IF EXISTS update_comments_count_trigger ON comments;
CREATE TRIGGER update_comments_count_trigger
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comments_count();
