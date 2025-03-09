
// Functions for parsing Gemini API responses

/**
 * Parse drawing instructions from the text response
 */
export const parseDrawingInstructions = (textResponse: string): any[] | undefined => {
  const drawingMatch = textResponse.match(/\[DRAWING_INSTRUCTIONS\]([\s\S]*?)\[\/DRAWING_INSTRUCTIONS\]/);
  
  if (drawingMatch && drawingMatch[1]) {
    try {
      const instructionsJson = JSON.parse(drawingMatch[1].trim());
      return instructionsJson.instructions;
    } catch (e) {
      console.error('Failed to parse drawing instructions:', e);
      return undefined;
    }
  }
  
  return undefined;
};

/**
 * Parse follow-up question from the text response
 */
export const parseFollowUpQuestion = (textResponse: string): { shouldAsk: boolean, question?: string } => {
  const followUpMatch = textResponse.match(/\[FOLLOW_UP\]([\s\S]*?)\[\/FOLLOW_UP\]/);
  
  if (followUpMatch && followUpMatch[1]) {
    return {
      shouldAsk: true,
      question: followUpMatch[1].trim()
    };
  }
  
  return {
    shouldAsk: false
  };
};

/**
 * Clean up the text response by removing instructions and follow-up sections
 */
export const cleanResponseText = (textResponse: string): string => {
  return textResponse
    .replace(/\[DRAWING_INSTRUCTIONS\][\s\S]*?\[\/DRAWING_INSTRUCTIONS\]/g, '')
    .replace(/\[FOLLOW_UP\][\s\S]*?\[\/FOLLOW_UP\]/g, '')
    .trim();
};
