
import { useState, useEffect } from 'react';
import { LessonSection } from './types';
import { generateGeminiResponse } from '@/services/gemini';
import { extractJsonFromResponse } from '@/services/gemini/parser';

export const useLessonData = (topic: string) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lessonSections, setLessonSections] = useState<LessonSection[]>([]);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Generate lesson content using Gemini API
    const generateLessonContent = async () => {
      try {
        const prompt = `Create a complete lesson about "${topic}" with 5 sections: 
        1. Introduction (general overview)
        2. Explanation (detailed explanation of key concepts)
        3. Example (practical example or application)
        4. Quiz (multiple choice question with 4 options and correct answer index)
        5. Summary (recap of key points)
        
        Format the response as a valid JSON array with each section having properties:
        - type (introduction, explanation, example, quiz, or summary)
        - title (section heading)
        - content (detailed text)
        - quiz (for quiz section only, with question, options array, and answer index)
        
        Make sure the content is educational, accurate, and at the right level for a student learning this topic.`;
        
        const systemMessage = {
          role: 'user' as const,
          parts: [{ text: "You are an educational content creator. Create detailed, accurate lessons that include engaging explanations, relevant examples, and appropriate assessments. Format your response as valid JSON when requested." }]
        };
        
        const response = await generateGeminiResponse(prompt, [systemMessage]);
        
        // Parse the JSON response using the utility function
        try {
          const sections = extractJsonFromResponse(response.text);
          setLessonSections(sections);
        } catch (error) {
          console.error('Error parsing lesson JSON:', error);
          // Fallback to mock data
          setLessonSections([
            {
              type: 'introduction',
              title: `Introduction to ${topic}`,
              content: 'This is an overview of the topic. The AI was unable to generate specific content, but you can explore this topic through the chat feature.'
            },
            {
              type: 'explanation',
              title: 'Key Concepts',
              content: 'This section would normally contain detailed explanations of key concepts related to this topic.'
            },
            {
              type: 'example',
              title: 'Practical Example',
              content: 'This section would normally contain practical examples and applications of this topic.'
            },
            {
              type: 'quiz',
              title: 'Check Your Understanding',
              content: 'Let\'s see if you understand the key concepts.',
              quiz: {
                question: 'What would be a good question about this topic?',
                options: [
                  'Option A',
                  'Option B',
                  'Option C',
                  'Option D'
                ],
                answer: 0
              }
            },
            {
              type: 'summary',
              title: `Summary of ${topic}`,
              content: 'This section would normally contain a summary of key points about this topic.'
            }
          ]);
        }
      } catch (error) {
        console.error('Error generating lesson content:', error);
        // Fallback to mock data
        setLessonSections([
          {
            type: 'introduction',
            title: `Introduction to ${topic}`,
            content: 'This is an overview of the topic. The AI was unable to generate specific content, but you can explore this topic through the chat feature.'
          },
          {
            type: 'explanation',
            title: 'Key Concepts',
            content: 'This section would normally contain detailed explanations of key concepts related to this topic.'
          },
          {
            type: 'example',
            title: 'Practical Example',
            content: 'This section would normally contain practical examples and applications of this topic.'
          },
          {
            type: 'quiz',
            title: 'Check Your Understanding',
            content: 'Let\'s see if you understand the key concepts.',
            quiz: {
              question: 'What would be a good question about this topic?',
              options: [
                'Option A',
                'Option B',
                'Option C',
                'Option D'
              ],
              answer: 0
            }
          },
          {
            type: 'summary',
            title: `Summary of ${topic}`,
            content: 'This section would normally contain a summary of key points about this topic.'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    generateLessonContent();
  }, [topic]);
  
  // Handle navigation between sections
  const handleNext = () => {
    if (currentSection < lessonSections.length - 1) {
      setCurrentSection(currentSection + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    }
  };
  
  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    }
  };
  
  // Handle quiz answer checking
  const checkAnswer = (index: number) => {
    const currentQuiz = lessonSections[currentSection]?.quiz;
    if (currentQuiz) {
      setSelectedAnswer(index);
      setIsAnswerCorrect(index === currentQuiz.answer);
    }
  };
  
  return {
    currentSection,
    lessonSections,
    selectedAnswer,
    isAnswerCorrect,
    isLoading,
    handleNext,
    handlePrevious,
    checkAnswer
  };
};
