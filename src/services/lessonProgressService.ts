
import { supabase } from '@/lib/supabase';

/**
 * Function to save lesson progress
 */
export const saveLessonProgress = async (
  userId: string,
  topic: string,
  completionPercentage: number
) => {
  try {
    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert(
        {
          user_id: userId,
          topic,
          completion_percentage: completionPercentage,
          last_accessed: new Date().toISOString(),
        },
        { onConflict: 'user_id, topic' }
      );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving lesson progress:', error);
    throw error;
  }
};
