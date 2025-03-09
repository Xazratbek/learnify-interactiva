
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LessonSection } from './types';

interface LessonProgressProps {
  currentSection: number;
  lessonSections: LessonSection[];
}

const LessonProgress: React.FC<LessonProgressProps> = ({ 
  currentSection, 
  lessonSections 
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="px-2 py-1">
          {`${currentSection + 1}/${lessonSections.length}`}
        </Badge>
        <p className="text-sm text-muted-foreground">
          {lessonSections[currentSection]?.type}
        </p>
      </div>
      <div className="flex space-x-1">
        {lessonSections.map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-1 w-10 rounded-full transition-colors",
              index === currentSection 
                ? "bg-primary" 
                : index < currentSection 
                  ? "bg-primary/40" 
                  : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default LessonProgress;
