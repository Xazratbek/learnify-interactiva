import { generateGeminiResponse } from './gemini';

/**
 * Function to get lesson content from AI
 */
export const getLessonContent = async (topic: string, learningStyle: string | null) => {
  try {
    // Generate lesson content using Gemini API
    const prompt = `Create a detailed lesson about "${topic}" tailored for ${learningStyle || 'visual'} learners. 
    Include an introduction, key concepts, practical examples, and summary. 
    If appropriate, include drawing instructions for a visual representation.`;
    
    const response = await generateGeminiResponse(prompt);
    
    return {
      title: `Understanding ${topic}`,
      introduction: response.text.split('\n\n')[0] || `Welcome to your personalized lesson on ${topic}.`,
      sections: [
        {
          heading: `Key Concepts of ${topic}`,
          content: response.text,
          examples: [],
        }
      ],
      summary: `This concludes our overview of ${topic}.`,
      exercises: [
        `Practice question 1 about ${topic}?`,
        `Practice question 2 about ${topic}?`,
      ],
      drawingInstructions: response.drawingInstructions || [],
    };
  } catch (error) {
    console.error('Error generating lesson content:', error);
    // Fallback to mock content if Gemini fails
    return mockGenerateLessonContent(topic, learningStyle);
  }
};

/**
 * Mock function to generate lesson content as fallback
 */
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
