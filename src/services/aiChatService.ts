
import { generateGeminiResponse, GeminiMessage } from './gemini';
import { AIResponseWithDrawing, DrawingInstruction } from './aiResponseTypes';

/**
 * AI Chat response generation
 */
export const generateAIResponse = async (
  userId: string,
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string | AIResponseWithDrawing> => {
  try {
    // Convert the conversation history to Gemini format
    const geminiHistory: GeminiMessage[] = conversationHistory.map(message => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }]
    } as GeminiMessage));
    
    // Generate response using Gemini API
    const response = await generateGeminiResponse(userMessage, geminiHistory);
    
    // If there are drawing instructions, return them along with the text
    if (response.drawingInstructions && response.drawingInstructions.length > 0) {
      return {
        text: response.text,
        drawingInstructions: response.drawingInstructions
      };
    }
    
    // Otherwise just return the text
    return response.text;
  } catch (error) {
    console.error('Error generating AI response:', error);
    // Fallback to mock responses if Gemini API fails
    return mockGenerateAIResponse(userMessage, conversationHistory);
  }
};

/**
 * Mock function to generate AI response as fallback
 */
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
