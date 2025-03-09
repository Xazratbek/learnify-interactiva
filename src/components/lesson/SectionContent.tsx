
import React from 'react';
import { BookText, Lightbulb, Star, HelpCircle, CheckCircle2 } from 'lucide-react';
import QuizSection from './QuizSection';
import { LessonSection } from './types';

interface SectionContentProps {
  section: LessonSection;
  selectedAnswer: number | null;
  isAnswerCorrect: boolean | null;
  checkAnswer: (index: number) => void;
  isLoading: boolean;
}

const SectionContent: React.FC<SectionContentProps> = ({
  section,
  selectedAnswer,
  isAnswerCorrect,
  checkAnswer,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 animate-pulse">
        <div className="h-8 w-3/4 bg-muted rounded-md" />
        <div className="h-4 w-full bg-muted rounded-md" />
        <div className="h-4 w-full bg-muted rounded-md" />
        <div className="h-4 w-2/3 bg-muted rounded-md" />
      </div>
    );
  }
  
  const getSectionIcon = (type: LessonSection['type']) => {
    switch (type) {
      case 'introduction':
        return <BookText className="h-5 w-5" />;
      case 'explanation':
        return <Lightbulb className="h-5 w-5" />;
      case 'example':
        return <Star className="h-5 w-5" />;
      case 'quiz':
        return <HelpCircle className="h-5 w-5" />;
      case 'summary':
        return <CheckCircle2 className="h-5 w-5" />;
      default:
        return <BookText className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        {getSectionIcon(section.type)}
        <h3 className="text-xl font-semibold">{section.title}</h3>
      </div>
      
      <p className="mb-6 text-foreground/90 leading-relaxed">
        {section.content}
      </p>
      
      {section.type === 'quiz' && section.quiz && (
        <QuizSection
          question={section.quiz.question}
          options={section.quiz.options}
          answer={section.quiz.answer}
          selectedAnswer={selectedAnswer}
          isAnswerCorrect={isAnswerCorrect}
          onSelectAnswer={checkAnswer}
        />
      )}
    </div>
  );
};

export default SectionContent;
