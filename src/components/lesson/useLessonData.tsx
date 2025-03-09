
import { useState, useEffect } from 'react';
import { LessonSection } from './types';

export const useLessonData = (topic: string) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lessonSections, setLessonSections] = useState<LessonSection[]>([]);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      // This is mock data - would be replaced with actual API call
      setLessonSections([
        {
          type: 'introduction',
          title: 'Introduction to Photosynthesis',
          content: 'Photosynthesis is the process used by plants, algae, and certain bacteria to convert light energy, usually from the sun, into chemical energy in the form of glucose or other sugars. These sugars are used by organisms for energy and to build other molecules. Photosynthesis is crucial for life on Earth as it maintains atmospheric oxygen levels and supplies all of the organic compounds and most of the energy necessary for life.'
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
      
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [topic]);
  
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
  
  const checkAnswer = (index: number) => {
    setSelectedAnswer(index);
    const currentQuiz = lessonSections[currentSection].quiz;
    if (currentQuiz) {
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
