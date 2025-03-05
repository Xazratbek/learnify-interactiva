
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  GitMerge, 
  BookOpen, 
  BarChart, 
  PenTool, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter animate-fade-in">
              Learn Anything with Your Personal
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                {" "}AI Tutor
              </span>
            </h1>
            <p className="text-xl text-foreground/80 md:text-2xl animate-fade-in" style={{ animationDelay: '100ms' }}>
              Experience interactive, personalized lessons powered by artificial intelligence.
              Master any topic at your own pace.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Button 
              size="lg" 
              onClick={() => navigate('/topics')}
              className="text-md gap-1 group"
            >
              Start Learning
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/about')}
              className="text-md"
            >
              Learn More
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <GitMerge className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-sm font-medium">Interactive Learning</h3>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="rounded-full bg-secondary/10 p-3">
                <BookOpen className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-sm font-medium">Diverse Topics</h3>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-sm font-medium">Progress Tracking</h3>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="rounded-full bg-secondary/10 p-3">
                <PenTool className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-sm font-medium">Visual Explanations</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
