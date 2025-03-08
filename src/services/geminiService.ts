
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Use a safer way to manage API keys 
const GEMINI_API_KEY = "AIzaSyDuzcaBSL2e3WraNewDeIvOU42yCb2IuSg";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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

    // Prepare the system prompt to guide Gemini to act as an AI tutor
    const systemPromptText = `You are an AI learning tutor designed to help students understand various educational topics. 
      Your primary goal is to provide clear, helpful explanations and guide the learning process.
      
      As an AI tutor, you should:
      1. Be patient, encouraging, and supportive in your responses
      2. Break down complex concepts into understandable parts
      3. Provide relevant examples to illustrate your explanations
      4. Identify key concepts and explain them in detail
      5. Ask follow-up questions to check understanding and encourage deeper learning
      6. Adapt your teaching approach based on the student's questions
      7. Provide a step-by-step explanation for complex processes
      8. Define technical terms when introducing them
      
      When explaining technical processes like web development or how the internet works:
      - Start with a high-level overview
      - Then break it down into sequential steps
      - Explain each component's role
      - Use analogies to make abstract concepts concrete
      
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
      
      After each explanation, consider whether a follow-up question would help gauge the student's understanding.
      If you think a follow-up question would be helpful, add it at the end of your response like this:
      [FOLLOW_UP]
      Do you understand how X relates to Y?
      [/FOLLOW_UP]
      
      Remember that your goal is not just to provide information, but to actively teach and guide the learning process.
      Focus on building understanding rather than simply delivering facts.`;

    // Get the Gemini model with safer configuration
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024, // Reduced token count for faster responses
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
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
    
    return {
      text: cleanedText,
      drawingInstructions,
      shouldAskFollowUp,
      followUpQuestion
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
