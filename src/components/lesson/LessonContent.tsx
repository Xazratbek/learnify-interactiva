
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  BookText,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonContentProps {
  topic: string;
  className?: string;
}

interface LessonSection {
  type: 'introduction' | 'explanation' | 'example' | 'summary' | 'quiz';
  title: string;
  content: string;
  quiz?: {
    question: string;
    options: string[];
    answer: number;
  };
}

const LessonContent: React.FC<LessonContentProps> = ({ topic, className }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Sample lesson data - in a real app, this would come from an API
  const [lessonSections, setLessonSections] = useState<LessonSection[]>([]);
  
  // Mock loading the lesson content
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
  
  const renderProgress = () => {
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
  
  const renderCurrentSection = () => {
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
    
    if (lessonSections.length === 0) {
      return (
        <div className="text-center p-6">
          <h3 className="text-lg font-medium">No lesson content available</h3>
          <p className="text-muted-foreground">
            Try selecting a different topic or check back later.
          </p>
        </div>
      );
    }
    
    const section = lessonSections[currentSection];
    
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
          <div className="mt-6 space-y-4">
            <h4 className="font-medium">{section.quiz.question}</h4>
            <div className="space-y-2">
              {section.quiz.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index 
                    ? (isAnswerCorrect ? "default" : "destructive") 
                    : "outline"
                  }
                  className={cn(
                    "w-full justify-start text-left",
                    selectedAnswer !== null && section.quiz?.answer === index && "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                  )}
                  onClick={() => checkAnswer(index)}
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
                  : `Not quite right. The correct answer is: ${section.quiz.options[section.quiz.answer]}`
                }
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Card className={cn("glassmorphism", className)}>
      <CardHeader className="pb-2">
        {renderProgress()}
      </CardHeader>
      
      <CardContent>
        {renderCurrentSection()}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4 border-t border-border/40">
        <Button
          variant="outline"
          onClick={handlePrevious}
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
          onClick={handleNext}
          disabled={currentSection === lessonSections.length - 1 || isLoading}
          className="gap-2"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LessonContent;
