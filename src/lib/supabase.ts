
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
