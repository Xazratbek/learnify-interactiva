
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useLessonData } from './useLessonData';
import LessonProgress from './LessonProgress';
import SectionContent from './SectionContent';
import LessonNavigation from './LessonNavigation';
import { LessonContentProps } from './types';

const LessonContent: React.FC<LessonContentProps> = ({ topic, className }) => {
  const {
    currentSection,
    lessonSections,
    selectedAnswer,
    isAnswerCorrect,
    isLoading,
    handleNext,
    handlePrevious,
    checkAnswer
  } = useLessonData(topic);
  
  return (
    <Card className={cn("glassmorphism", className)}>
      <CardHeader className="pb-2">
        <LessonProgress 
          currentSection={currentSection} 
          lessonSections={lessonSections} 
        />
      </CardHeader>
      
      <CardContent>
        {lessonSections.length === 0 && !isLoading ? (
          <div className="text-center p-6">
            <h3 className="text-lg font-medium">No lesson content available</h3>
            <p className="text-muted-foreground">
              Try selecting a different topic or check back later.
            </p>
          </div>
        ) : (
          currentSection < lessonSections.length && (
            <SectionContent
              section={lessonSections[currentSection]}
              selectedAnswer={selectedAnswer}
              isAnswerCorrect={isAnswerCorrect}
              checkAnswer={checkAnswer}
              isLoading={isLoading}
            />
          )
        )}
      </CardContent>
      
      <CardFooter>
        <LessonNavigation
          currentSection={currentSection}
          totalSections={lessonSections.length}
          isLoading={isLoading}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </CardFooter>
    </Card>
  );
};

export default LessonContent;
