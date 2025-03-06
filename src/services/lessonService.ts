
import { supabase } from '@/lib/supabase';

// Function to save lesson progress
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

// Function to get lesson content from AI
export const getLessonContent = async (topic: string, learningStyle: string | null) => {
  try {
    // In a real implementation, this would call your Gemini API
    // For demo purposes, we're returning mock content
    return mockGenerateLessonContent(topic, learningStyle);
  } catch (error) {
    console.error('Error generating lesson content:', error);
    throw error;
  }
};

// Mock function to generate lesson content
const mockGenerateLessonContent = (topic: string, learningStyle: string | null) => {
  const style = learningStyle || 'visual';
  
  const content = {
    title: `Understanding ${topic}`,
    introduction: `Welcome to your personalized lesson on ${topic}. This lesson is tailored to your ${style} learning style.`,
    sections: [
      {
        heading: `Key Concepts of ${topic}`,
        content: `Here we'll explore the fundamental concepts of ${topic} with examples and explanations designed for ${style} learners.`,
        examples: [`Example 1 related to ${topic}`, `Example 2 related to ${topic}`],
      },
      {
        heading: `Applications of ${topic}`,
        content: `Let's see how ${topic} is applied in real-world scenarios, with ${style}-focused demonstrations.`,
        examples: [`Real-world application 1`, `Real-world application 2`],
      },
    ],
    summary: `This concludes our overview of ${topic}. Remember these key points...`,
    exercises: [
      `Practice question 1 about ${topic}?`,
      `Practice question 2 about ${topic}?`,
    ],
    drawingInstructions: style === 'visual' ? [
      { type: 'circle', x: 200, y: 200, radius: 50, color: '#FF5733' },
      { type: 'text', x: 200, y: 200, text: topic, color: '#000000' },
      { type: 'line', x1: 100, y1: 300, x2: 300, y2: 100, color: '#3366FF' },
    ] : [],
  };
  
  return content;
};

// Define the AI response types
export interface DrawingInstruction {
  type: string;
  x?: number;
  y?: number;
  radius?: number;
  color?: string;
  text?: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  width?: number;
  height?: number;
}

export interface AIResponseWithDrawing {
  text: string;
  drawingInstructions: DrawingInstruction[];
}

// AI Chat response generation
export const generateAIResponse = async (
  userId: string,
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string | AIResponseWithDrawing> => {
  try {
    // In a real implementation, this would call your Gemini API
    // For demo purposes, we're returning mock responses
    return mockGenerateAIResponse(userMessage, conversationHistory);
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};

// Mock function to generate AI response
const mockGenerateAIResponse = (
  userMessage: string, 
  conversationHistory: Array<{ role: string; content: string }>
): string | AIResponseWithDrawing => {
  const message = userMessage.toLowerCase();
  
  if (message.includes('hello') || message.includes('hi')) {
    return "Hello! How can I help you with your learning today?";
  } else if (message.includes('photosynthesis')) {
    return "Photosynthesis is the process by which plants convert light energy into chemical energy. The key components include chlorophyll, carbon dioxide, water, and sunlight. Would you like me to draw this process on the whiteboard?";
  } else if (message.includes('draw') || message.includes('whiteboard')) {
    return {
      text: "I've drawn a simple diagram to illustrate this concept. You can add your own annotations to highlight areas you find interesting or confusing.",
      drawingInstructions: [
        { type: 'clear' },
        { type: 'circle', x: 200, y: 150, radius: 80, color: '#22c55e' },
        { type: 'text', x: 200, y: 150, text: 'Key Concept', color: '#000000' },
        { type: 'arrow', x1: 200, y1: 250, x2: 200, y2: 350, color: '#3b82f6' },
        { type: 'rect', x: 150, y: 350, width: 100, height: 80, color: '#f59e0b' },
        { type: 'text', x: 200, y: 390, text: 'Result', color: '#000000' },
      ]
    };
  } else {
    return "That's an interesting question about " + userMessage + ". Let me explain this concept in detail. The key principles to understand are... Would you like me to illustrate this on the whiteboard?";
  }
};

// Save whiteboard data
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

// Get saved whiteboard data
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
