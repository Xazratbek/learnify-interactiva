// Functions for parsing Gemini API responses

/**
 * Parse drawing instructions from the text response
 */
export const parseDrawingInstructions = (textResponse: string): any[] | undefined => {
  try {
    // Look for JSON array of drawing instructions in the response
    const jsonRegex = /\[\s*\{\s*"type"\s*:/;
    if (jsonRegex.test(textResponse)) {
      const jsonStartIndex = textResponse.search(jsonRegex);
      if (jsonStartIndex !== -1) {
        // Extract JSON from the response
        let bracketCount = 0;
        let endIndex = jsonStartIndex;
        let inString = false;
        let escapeNext = false;
        
        for (let i = jsonStartIndex; i < textResponse.length; i++) {
          const char = textResponse[i];
          
          if (escapeNext) {
            escapeNext = false;
            continue;
          }
          
          if (char === '\\') {
            escapeNext = true;
            continue;
          }
          
          if (char === '"' && !escapeNext) {
            inString = !inString;
            continue;
          }
          
          if (!inString) {
            if (char === '[') bracketCount++;
            if (char === ']') {
              bracketCount--;
              if (bracketCount === 0) {
                endIndex = i + 1;
                break;
              }
            }
          }
        }
        
        const jsonString = textResponse.substring(jsonStartIndex, endIndex);
        try {
          return JSON.parse(jsonString);
        } catch (e) {
          console.error('Failed to parse JSON drawing instructions:', e);
        }
      }
    }
    
    // Fall back to the original bracketed format if JSON parsing fails
    const drawingMatch = textResponse.match(/\[DRAWING_INSTRUCTIONS\]([\s\S]*?)\[\/DRAWING_INSTRUCTIONS\]/);
    if (drawingMatch && drawingMatch[1]) {
      try {
        const instructionsJson = JSON.parse(drawingMatch[1].trim());
        return instructionsJson.instructions;
      } catch (e) {
        console.error('Failed to parse drawing instructions:', e);
      }
    }
    
    return undefined;
  } catch (error) {
    console.error('Error parsing drawing instructions:', error);
    return undefined;
  }
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
  let cleaned = textResponse;
  
  // Remove JSON drawing instructions if they exist
  const jsonRegex = /\[\s*\{\s*"type"\s*:/;
  if (jsonRegex.test(cleaned)) {
    const jsonStartIndex = cleaned.search(jsonRegex);
    if (jsonStartIndex !== -1) {
      let bracketCount = 0;
      let endIndex = jsonStartIndex;
      let inString = false;
      let escapeNext = false;
      
      for (let i = jsonStartIndex; i < cleaned.length; i++) {
        const char = cleaned[i];
        
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        
        if (char === '\\') {
          escapeNext = true;
          continue;
        }
        
        if (char === '"' && !escapeNext) {
          inString = !inString;
          continue;
        }
        
        if (!inString) {
          if (char === '[') bracketCount++;
          if (char === ']') {
            bracketCount--;
            if (bracketCount === 0) {
              endIndex = i + 1;
              break;
            }
          }
        }
      }
      
      cleaned = cleaned.substring(0, jsonStartIndex) + cleaned.substring(endIndex);
    }
  }
  
  // Remove bracketed sections
  return cleaned
    .replace(/\[DRAWING_INSTRUCTIONS\][\s\S]*?\[\/DRAWING_INSTRUCTIONS\]/g, '')
    .replace(/\[FOLLOW_UP\][\s\S]*?\[\/FOLLOW_UP\]/g, '')
    .trim();
};

/**
 * Extract JSON from a response that may be wrapped in markdown code blocks
 */
export const extractJsonFromResponse = (response: string): any => {
  try {
    // Try to extract JSON if it's wrapped in markdown code blocks
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    
    // If we found a markdown code block, try to parse its contents
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1].trim());
    }
    
    // If no markdown code block, try to parse the entire response as JSON
    return JSON.parse(response.trim());
  } catch (error) {
    console.error('Error extracting JSON from response:', error);
    // Return an empty array or object as fallback
    return [];
  }
};
