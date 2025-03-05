import { useState } from 'react';
import { supabase, WhiteboardData } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useWhiteboardData = (lessonId: string) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [whiteboard, setWhiteboard] = useState<WhiteboardData | null>(null);

  const fetchWhiteboardData = async () => {
    if (!user) return null;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('whiteboard_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setWhiteboard(data as WhiteboardData);
      }
      
      return data as WhiteboardData | null;
    } catch (error: any) {
      console.error('Error fetching whiteboard data:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveWhiteboardData = async (drawingData: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const now = new Date().toISOString();
      
      const whiteboardData = {
        user_id: user.id,
        lesson_id: lessonId,
        drawing_data: drawingData,
        updated_at: now,
      };
      
      // If we already have a record, update it
      if (whiteboard?.id) {
        const { error } = await supabase
          .from('whiteboard_data')
          .update(whiteboardData)
          .eq('id', whiteboard.id);
        
        if (error) throw error;
        
        setWhiteboard({
          ...whiteboard,
          ...whiteboardData,
        } as WhiteboardData);
      } else {
        // Otherwise create a new record
        const newWhiteboardData = {
          ...whiteboardData,
          created_at: now,
        };
        
        const { data, error } = await supabase
          .from('whiteboard_data')
          .insert([newWhiteboardData])
          .select()
          .single();
        
        if (error) throw error;
        
        setWhiteboard(data as WhiteboardData);
      }
      
      toast('Whiteboard saved successfully');
      return true;
    } catch (error: any) {
      console.error('Error saving whiteboard data:', error);
      toast('Failed to save whiteboard', {
        description: error.message || 'An unexpected error occurred'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    whiteboard,
    loading,
    fetchWhiteboardData,
    saveWhiteboardData,
  };
};
