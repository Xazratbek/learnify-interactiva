
import { createClient } from '@supabase/supabase-js';

// Use provided credentials or fall back to defaults for local development
const supabaseUrl = 'https://gojskvasupkccpnugvjr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvanNrdmFzdXBrY2NwbnVndmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDE1NTEsImV4cCI6MjA1NjgxNzU1MX0.9mTZgqTgITuo4SRj0TNqTdcQ6UIl4Pky7T32i-nPsR4';

// Create the Supabase client
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
