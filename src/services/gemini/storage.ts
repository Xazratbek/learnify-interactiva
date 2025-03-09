
import { supabase } from '@/lib/supabase';
import { GeminiMessage } from './types';

/**
 * Function to save conversation to the database
 */
export const saveConversation = async (
  userId: string, 
  messages: GeminiMessage[]
) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        messages: messages,
        created_at: new Date().toISOString()
      });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving conversation:', error);
    throw error;
  }
};

/**
 * Function to get conversation history for a user
 */
export const getConversationHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting conversation history:', error);
    return [];
  }
};
