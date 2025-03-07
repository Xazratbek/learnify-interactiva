
import { supabase } from '@/lib/supabase';

/**
 * Save whiteboard data
 */
export const saveWhiteboardData = async (
  userId: string,
  lessonId: string,
  drawingData: string
) => {
  try {
    const { data, error } = await supabase
      .from('whiteboard_data')
      .upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          drawing_data: drawingData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id, lesson_id' }
      );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving whiteboard data:', error);
    throw error;
  }
};

/**
 * Get saved whiteboard data
 */
export const getWhiteboardData = async (userId: string, lessonId: string) => {
  try {
    const { data, error } = await supabase
      .from('whiteboard_data')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.drawing_data || null;
  } catch (error) {
    console.error('Error getting whiteboard data:', error);
    throw error;
  }
};
