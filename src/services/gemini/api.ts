import { genAI, defaultGenerationConfig, defaultSafetySettings, GEMINI_MODEL } from './config';
import { GeminiMessage, GeminiResponse } from './types';
import { parseGeminiResponse } from './parser'; // Updated import
import { toast } from 'sonner';

/**
 * Generate a response from Gemini API
 */
export const generateGeminiResponse = async (
  prompt: string,
  conversationHistory: GeminiMessage[] = []
): Promise<GeminiResponse> => {
  try {
    console.log('Starting generateGeminiResponse function...');
    console.log('Prompt:', prompt);
    console.log('Conversation History:', conversationHistory);

    // Ensure the first message in the history has the role 'user'
    const history = conversationHistory.length > 0 && conversationHistory[0].role === 'user'
      ? [...conversationHistory]
      : [{ role: 'user', parts: [{ text: prompt }] }];

    console.log('History after validation:', history);

    // Get the Gemini model with configuration
    console.log('Getting Gemini model...');
    const model = genAI.getGenerativeModel({ 
      model: GEMINI_MODEL,
      generationConfig: {
        ...defaultGenerationConfig,
        maxOutputTokens: 5000, // Increased token limit
      },
      safetySettings: defaultSafetySettings,
    });
    console.log('Model initialized:', model);

    // Convert conversation history to client library format
    console.log('Converting conversation history...');
    const clientHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.parts[0].text }]
    }));
    console.log('Client history:', clientHistory);

    // Start a new chat session with history
    console.log('Starting chat session...');
    const chat = model.startChat({
      history: clientHistory,
      generationConfig: {
        maxOutputTokens: 5000, // Increased token limit
      },
    });
    console.log('Chat session started:', chat);

    // Set up a timeout for the API call
    console.log('Setting up timeout...');
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('API request timed out')), 30000); // 30 seconds timeout
    });

    // Send the message with a timeout
    console.log('Sending message to Gemini API...');
    const responsePromise = chat.sendMessage(prompt);
    const result = await Promise.race([responsePromise, timeoutPromise]);
    console.log('API response received:', result);

    // If we get here, the API call completed before the timeout
    const textResponse = result.response.text();
    console.log('Text response:', textResponse);

    // Parse the Gemini response using the new parseGeminiResponse function
    const parsedResponse = parseGeminiResponse(textResponse);
    console.log('Parsed response:', parsedResponse);

    console.log('Returning final response...');
    return {
      text: parsedResponse.text,
      drawingInstructions: parsedResponse.drawingInstructions,
      shouldAskFollowUp: parsedResponse.shouldAskFollowUp,
      followUpQuestion: parsedResponse.followUpQuestion,
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
