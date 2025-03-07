
import { supabase } from '@/lib/supabase';

const GEMINI_API_KEY = "AIzaSyDuzcaBSL2e3WraNewDeIvOU42yCb2IuSg";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: {
    text: string;
  }[];
}

export interface GeminiResponse {
  text: string;
  drawingInstructions?: any[];
  shouldAskFollowUp?: boolean;
  followUpQuestion?: string;
}

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

    // Prepare the system prompt to guide Gemini
    const systemPrompt = {
      role: 'system',
      parts: [{ text: `You are an AI learning assistant that helps students understand various topics. 
      Provide clear explanations and ask follow-up questions to ensure understanding. 
      When appropriate, create visual explanations using diagrams.
      
      If your explanation would benefit from a visual representation, include drawing instructions in your response following this format:
      [DRAWING_INSTRUCTIONS]
      {
        "instructions": [
          {"type": "circle", "x": 200, "y": 150, "radius": 80, "color": "#22c55e"},
          {"type": "text", "x": 200, "y": 150, "text": "Example", "color": "#000000"},
          {"type": "arrow", "x1": 200, "y1": 250, "x2": 200, "y2": 350, "color": "#3b82f6"}
        ]
      }
      [/DRAWING_INSTRUCTIONS]
      
      After each explanation, consider whether a follow-up question would help gauge the user's understanding.
      If you think a follow-up question would be helpful, add it at the end of your response like this:
      [FOLLOW_UP]
      Do you understand how X relates to Y?
      [/FOLLOW_UP]` 
      }]
    };

    // Construct the full prompt with system instructions
    const messages = [
      systemPrompt,
      ...history
    ];

    // Make the API request to Gemini
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the text response
    const textResponse = data.candidates[0]?.content?.parts[0]?.text || "I couldn't generate a response. Please try again.";
    
    // Parse drawing instructions if they exist
    let drawingInstructions = undefined;
    const drawingMatch = textResponse.match(/\[DRAWING_INSTRUCTIONS\]([\s\S]*?)\[\/DRAWING_INSTRUCTIONS\]/);
    
    if (drawingMatch && drawingMatch[1]) {
      try {
        const instructionsJson = JSON.parse(drawingMatch[1].trim());
        drawingInstructions = instructionsJson.instructions;
      } catch (e) {
        console.error('Failed to parse drawing instructions:', e);
      }
    }
    
    // Parse follow-up question if it exists
    let shouldAskFollowUp = false;
    let followUpQuestion = undefined;
    const followUpMatch = textResponse.match(/\[FOLLOW_UP\]([\s\S]*?)\[\/FOLLOW_UP\]/);
    
    if (followUpMatch && followUpMatch[1]) {
      shouldAskFollowUp = true;
      followUpQuestion = followUpMatch[1].trim();
    }
    
    // Clean up the text response by removing the instructions and follow-up
    let cleanedText = textResponse
      .replace(/\[DRAWING_INSTRUCTIONS\][\s\S]*?\[\/DRAWING_INSTRUCTIONS\]/g, '')
      .replace(/\[FOLLOW_UP\][\s\S]*?\[\/FOLLOW_UP\]/g, '')
      .trim();
    
    // Add the response to history for context
    history.push({
      role: 'model',
      parts: [{ text: cleanedText }]
    });
    
    // Save the conversation to the database if a user is logged in
    // This would typically be done in the component that calls this function,
    // but we'll include logic here to show how it could be done
    
    return {
      text: cleanedText,
      drawingInstructions,
      shouldAskFollowUp,
      followUpQuestion
    };
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    throw error;
  }
};

// Function to save conversation to the database
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

// Function to get conversation history for a user
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
