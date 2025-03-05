
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <div className="space-y-4 max-w-3xl mb-8">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Ready to Transform Your Learning Experience?
            </h2>
            <p className="text-foreground/80 md:text-lg">
              Join thousands of students who are mastering new subjects with the help of AI Tutor.
              Start your personalized learning journey today.
            </p>
          </div>
          
          <Button 
            size="lg" 
            onClick={() => navigate('/topics')}
            className="group"
          >
            Start Learning Now
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
