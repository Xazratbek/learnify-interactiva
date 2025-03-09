
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizSectionProps {
  question: string;
  options: string[];
  answer: number;
  selectedAnswer: number | null;
  isAnswerCorrect: boolean | null;
  onSelectAnswer: (index: number) => void;
}

const QuizSection: React.FC<QuizSectionProps> = ({
  question,
  options,
  answer,
  selectedAnswer,
  isAnswerCorrect,
  onSelectAnswer
}) => {
  return (
    <div className="mt-6 space-y-4">
      <h4 className="font-medium">{question}</h4>
      <div className="space-y-2">
        {options.map((option, index) => (
          <Button
            key={index}
            variant={selectedAnswer === index 
              ? (isAnswerCorrect ? "default" : "destructive") 
              : "outline"
            }
            className={cn(
              "w-full justify-start text-left",
              selectedAnswer !== null && answer === index && "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
            )}
            onClick={() => onSelectAnswer(index)}
            disabled={selectedAnswer !== null}
          >
            {selectedAnswer === index && isAnswerCorrect && (
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
            )}
            {option}
          </Button>
        ))}
      </div>
      
      {selectedAnswer !== null && (
        <div className={cn(
          "p-3 rounded-md mt-4",
          isAnswerCorrect 
            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
        )}>
          {isAnswerCorrect 
            ? "Correct! You've understood this concept well." 
            : `Not quite right. The correct answer is: ${options[answer]}`
          }
        </div>
      )}
    </div>
  );
};

export default QuizSection;
