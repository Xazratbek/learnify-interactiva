
// Common types for lesson components
export interface LessonSection {
  type: 'introduction' | 'explanation' | 'example' | 'summary' | 'quiz';
  title: string;
  content: string;
  quiz?: {
    question: string;
    options: string[];
    answer: number;
  };
}

export interface LessonContentProps {
  topic: string;
  className?: string;
}
