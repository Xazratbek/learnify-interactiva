
import { useState } from 'react';
import { supabase, LessonProgress } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useLessonProgress = (topic: string) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<LessonProgress | null>(null);

  const fetchProgress = async () => {
    if (!user) return null;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('topic', topic)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setProgress(data as LessonProgress);
        return data as LessonProgress;
      }
      
      // No existing progress found, create a new record
      const newProgress: Partial<LessonProgress> = {
        user_id: user.id,
        topic,
        completion_percentage: 0,
        last_accessed: new Date().toISOString(),
      };
      
      const { data: newData, error: insertError } = await supabase
        .from('lesson_progress')
        .insert([newProgress])
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      setProgress(newData as LessonProgress);
      return newData as LessonProgress;
    } catch (error: any) {
      console.error('Error fetching lesson progress:', error);
      toast('Failed to load lesson progress', {
        description: error.message || 'An unexpected error occurred'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (completionPercentage: number) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const updatedProgress = {
        user_id: user.id,
        topic,
        completion_percentage: completionPercentage,
        last_accessed: new Date().toISOString(),
      };
      
      let query = supabase
        .from('lesson_progress')
        .upsert(updatedProgress);
      
      if (progress?.id) {
        query = query.eq('id', progress.id);
      } else {
        query = query.eq('user_id', user.id).eq('topic', topic);
      }
      
      const { error } = await query;
      
      if (error) throw error;
      
      // Update local state
      setProgress({
        ...progress,
        ...updatedProgress,
      } as LessonProgress);
      
      return true;
    } catch (error: any) {
      console.error('Error updating lesson progress:', error);
      toast('Failed to update progress', {
        description: error.message || 'An unexpected error occurred'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    progress,
    loading,
    fetchProgress,
    updateProgress,
  };
};
