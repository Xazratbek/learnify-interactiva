
import { genAI, defaultGenerationConfig, defaultSafetySettings, GEMINI_MODEL } from './config';
import { GeminiMessage, GeminiResponse } from './types';
import { parseDrawingInstructions, parseFollowUpQuestion, cleanResponseText } from './parser';
import { toast } from 'sonner';

/**
 * Generate a response from Gemini API
 */
export const generateGeminiResponse = async (
  prompt: string,
  conversationHistory: GeminiMessage[] = []
): Promise<GeminiResponse> => {
  try {
    // Create a copy of the history to avoid mutating the original
    const history = [...conversationHistory];
    
    // Get the Gemini model with configuration
    const model = genAI.getGenerativeModel({ 
      model: GEMINI_MODEL,
      generationConfig: defaultGenerationConfig,
      safetySettings: defaultSafetySettings,
    });

    // Convert conversation history to client library format
    const clientHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.parts[0].text }]
    }));

    // Start a new chat session with history
    const chat = model.startChat({
      history: clientHistory,
      generationConfig: {
        maxOutputTokens: 1024,
      },
    });

    // Set up a timeout for the API call
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('API request timed out')), 30000); // 30 seconds timeout
    });

    // Send the message with a timeout
    const responsePromise = chat.sendMessage(prompt);
    const result = await Promise.race([responsePromise, timeoutPromise]);
    
    // If we get here, the API call completed before the timeout
    const textResponse = result.response.text();
    
    // Parse drawing instructions if they exist
    const drawingInstructions = parseDrawingInstructions(textResponse);
    
    // Parse follow-up question if it exists
    const { shouldAsk, question } = parseFollowUpQuestion(textResponse);
    
    // Clean up the text response
    const cleanedText = cleanResponseText(textResponse);
    
    return {
      text: cleanedText,
      drawingInstructions,
      shouldAskFollowUp: shouldAsk,
      followUpQuestion: question
    };
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    
    // Show a toast notification for the error
    toast.error('Failed to get AI response', {
      description: 'Please try again in a moment',
    });
    
    return {
      text: "I'm sorry, I couldn't generate a response at the moment. Please try again in a few moments.",
      drawingInstructions: undefined,
      shouldAskFollowUp: false,
      followUpQuestion: undefined
    };
  }
};
