export interface Post {
  id: string;
  title: string;
  write_up: string;
  caption: string;
  image_url: string;
  alt_text: string;
  author_name: string;
  author_email?: string;
  author_id?: string;
  likes_count: number;
  comments_count: number;
  status: 'pending' | 'published' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  published_at?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_id?: string;
  text: string;
  created_at: string;
}

export interface Like {
  id: string;
  post_id: string;
  user_id?: string;
  session_id?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  email?: string;
  role: 'user' | 'admin' | 'moderator';
  created_at: string;
}

export interface ModerationLog {
  id: string;
  post_id: string;
  moderator_id: string;
  action: 'approved' | 'rejected' | 'deleted' | 'edited';
  reason?: string;
  created_at: string;
}
