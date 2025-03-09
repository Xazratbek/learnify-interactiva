
import { genAI, defaultGenerationConfig, defaultSafetySettings } from './gemini/config';
import { GeminiMessage, GeminiResponse } from './gemini/types';
import { parseDrawingInstructions, parseFollowUpQuestion, cleanResponseText } from './gemini/parser';

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
    
    // Add the current prompt to history
    history.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    // Get the Gemini model with safer configuration
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: defaultGenerationConfig,
      safetySettings: defaultSafetySettings,
    });

    // Convert conversation history to client library format
    const clientHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.parts[0].text }]
    }));

    // Start a new chat session
    const chat = model.startChat({
      history: clientHistory,
      generationConfig: {
        maxOutputTokens: 1024, // Reduced token count for faster responses
      },
    });

    // Send the message with the system prompt
    const result = await chat.sendMessage(prompt);
    const textResponse = result.response.text();
    
    // Parse drawing instructions if they exist
    const drawingInstructions = parseDrawingInstructions(textResponse);
    
    // Parse follow-up question if it exists
    const { shouldAsk, question } = parseFollowUpQuestion(textResponse);
    
    // Clean up the text response
    const cleanedText = cleanResponseText(textResponse);
    
    // Add the response to history for context
    history.push({
      role: 'model',
      parts: [{ text: cleanedText }]
    });
    
    return {
      text: cleanedText,
      drawingInstructions,
      shouldAskFollowUp: shouldAsk,
      followUpQuestion: question
    };
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    return {
      text: "I'm sorry, I couldn't generate a response at the moment. Please try again in a few moments.",
      drawingInstructions: undefined,
      shouldAskFollowUp: false,
      followUpQuestion: undefined
    };
  }
};
