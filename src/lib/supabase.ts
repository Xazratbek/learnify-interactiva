
import { createClient } from '@supabase/supabase-js';

// Default mock URLs for development when environment variables aren't set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'example-anon-key';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Show a console warning if using mock values
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase environment variables. Using mock values for development.');
}

export type UserProfile = {
  id: string;
  email: string;
  username: string | null;
  learning_style: string | null;
  created_at: string;
};

export type LessonProgress = {
  id: string;
  user_id: string;
  topic: string;
  completion_percentage: number;
  last_accessed: string;
};

export type WhiteboardData = {
  id: string;
  user_id: string;
  lesson_id: string;
  drawing_data: string;
  created_at: string;
  updated_at: string;
};
