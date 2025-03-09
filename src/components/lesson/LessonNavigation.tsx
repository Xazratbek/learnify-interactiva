
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ArrowRight, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle 
} from 'lucide-react';

interface LessonNavigationProps {
  currentSection: number;
  totalSections: number;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const LessonNavigation: React.FC<LessonNavigationProps> = ({
  currentSection,
  totalSections,
  isLoading,
  onPrevious,
  onNext
}) => {
  return (
    <div className="flex justify-between pt-4 border-t border-border/40">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentSection === 0 || isLoading}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Previous
      </Button>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon"
          className="text-green-600 hover:text-green-700"
        >
          <ThumbsUp className="h-4 w-4" />
          <span className="sr-only">Helpful</span>
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          className="text-red-600 hover:text-red-700"
        >
          <ThumbsDown className="h-4 w-4" />
          <span className="sr-only">Not Helpful</span>
        </Button>
        <Button 
          variant="outline" 
          size="icon"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="sr-only">Ask a question</span>
        </Button>
      </div>
      
      <Button
        onClick={onNext}
        disabled={currentSection === totalSections - 1 || isLoading}
        className="gap-2"
      >
        Next
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default LessonNavigation;
