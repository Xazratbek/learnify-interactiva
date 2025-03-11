/**
 * Parse drawing instructions from the text response
 */
export const parseDrawingInstructions = (text: string): any[] => {
  try {
    // Look for JSON block in the response (wrapped in markdown code blocks)
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) return [];

    const jsonString = jsonMatch[1];
    const instructions = JSON.parse(jsonString);

    // Validate the basic structure
    if (!Array.isArray(instructions)) return [];

    // Map instructions to a standardized format
    return instructions.map(instruction => ({
      type: instruction.type || 'line', // Default to 'line' if type is missing
      points: instruction.points || [], // Ensure points is an array
      color: instruction.color || '#000000', // Default to black if color is missing
      width: instruction.width || 2, // Default width of 2 if missing
      label: instruction.label || '', // Default to empty label if missing
    }));
  } catch (error) {
    console.error('Error parsing drawing instructions:', error);
    return [];
  }
};

/**
 * Parse follow-up question from the text response
 */
export const parseFollowUpQuestion = (text: string) => {
  // Look for a follow-up question in the format [QUESTION]: <question>
  const questionMatch = text.match(/\[QUESTION\]:\s*(.+?)\s*(\n|$)/);
  return {
    shouldAsk: !!questionMatch, // Boolean indicating if a follow-up question exists
    question: questionMatch?.[1] || '', // Extract the question text
  };
};

/**
 * Clean up the text response by removing unnecessary sections
 */
export const cleanResponseText = (text: string) => {
  return text
    .replace(/```json[\s\S]*?```/g, '') // Remove JSON code blocks
    .replace(/\[QUESTION\]:.*?(\n|$)/g, '') // Remove follow-up question markers
    .trim(); // Trim leading/trailing whitespace
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
    // Return an empty array as fallback
    return [];
  }
};

/**
 * Parse the full Gemini response into structured data
 */
export const parseGeminiResponse = (textResponse: string) => {
  const drawingInstructions = parseDrawingInstructions(textResponse);
  const { shouldAsk, question } = parseFollowUpQuestion(textResponse);
  const cleanedText = cleanResponseText(textResponse);

  return {
    text: cleanedText,
    drawingInstructions,
    shouldAskFollowUp: shouldAsk,
    followUpQuestion: question,
  };
};
