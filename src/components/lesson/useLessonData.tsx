import { useState, useEffect } from 'react';
import { LessonSection } from './types';
import { generateGeminiResponse } from '@/services/gemini';

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
        
        // Parse the JSON response
        const contentText = response.text.trim();
        // Extract JSON if it's wrapped in markdown code blocks
        const jsonMatch = contentText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, contentText];
        const jsonString = jsonMatch[1].trim();
        
        let sections: LessonSection[] = [];
        
        try {
          sections = JSON.parse(jsonString);
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
              title: 'The Process of Photosynthesis',
              content: 'Photosynthesis takes place in two stages: the light-dependent reactions and the Calvin cycle. In the light-dependent reactions, which occur in the thylakoid membrane, energy from sunlight is captured and used to produce ATP and NADPH. These energy-carrying molecules power the second stage, the Calvin cycle, which takes place in the stroma. During the Calvin cycle, carbon dioxide from the atmosphere is fixed into organic compounds, ultimately producing glucose.'
            },
            {
              type: 'example',
              title: 'Photosynthesis in Action',
              content: 'Consider a leaf on a sunny day. As sunlight strikes the leaf, chlorophyll molecules in the chloroplasts absorb the light energy. This energy is used to split water molecules, releasing oxygen as a byproduct. The hydrogen from water and carbon dioxide from the air are then used to create glucose, which the plant uses for energy and growth. This is why plants need sunlight, water, and carbon dioxide to survive, and why they release oxygen into the atmosphere.'
            },
            {
              type: 'quiz',
              title: 'Check Your Understanding',
              content: 'Let\'s see if you understand the key concepts of photosynthesis.',
              quiz: {
                question: 'What are the primary inputs needed for photosynthesis?',
                options: [
                  'Oxygen and glucose',
                  'Carbon dioxide and water',
                  'Nitrogen and phosphorus',
                  'ATP and NADPH'
                ],
                answer: 1
              }
            },
            {
              type: 'summary',
              title: 'Summary of Photosynthesis',
              content: 'Photosynthesis is the fundamental process that converts light energy into chemical energy, supporting nearly all life on Earth. Plants use carbon dioxide, water, and sunlight to produce glucose and oxygen. The process occurs in two main stages: the light-dependent reactions and the Calvin cycle. Understanding photosynthesis helps us appreciate how plants convert sunlight into the energy that powers the entire ecosystem.'
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
            title: 'The Process of Photosynthesis',
            content: 'Photosynthesis takes place in two stages: the light-dependent reactions and the Calvin cycle. In the light-dependent reactions, which occur in the thylakoid membrane, energy from sunlight is captured and used to produce ATP and NADPH. These energy-carrying molecules power the second stage, the Calvin cycle, which takes place in the stroma. During the Calvin cycle, carbon dioxide from the atmosphere is fixed into organic compounds, ultimately producing glucose.'
          },
          {
            type: 'example',
            title: 'Photosynthesis in Action',
            content: 'Consider a leaf on a sunny day. As sunlight strikes the leaf, chlorophyll molecules in the chloroplasts absorb the light energy. This energy is used to split water molecules, releasing oxygen as a byproduct. The hydrogen from water and carbon dioxide from the air are then used to create glucose, which the plant uses for energy and growth. This is why plants need sunlight, water, and carbon dioxide to survive, and why they release oxygen into the atmosphere.'
          },
          {
            type: 'quiz',
            title: 'Check Your Understanding',
            content: 'Let\'s see if you understand the key concepts of photosynthesis.',
            quiz: {
              question: 'What are the primary inputs needed for photosynthesis?',
              options: [
                'Oxygen and glucose',
                'Carbon dioxide and water',
                'Nitrogen and phosphorus',
                'ATP and NADPH'
              ],
              answer: 1
            }
          },
          {
            type: 'summary',
            title: 'Summary of Photosynthesis',
            content: 'Photosynthesis is the fundamental process that converts light energy into chemical energy, supporting nearly all life on Earth. Plants use carbon dioxide, water, and sunlight to produce glucose and oxygen. The process occurs in two main stages: the light-dependent reactions and the Calvin cycle. Understanding photosynthesis helps us appreciate how plants convert sunlight into the energy that powers the entire ecosystem.'
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
