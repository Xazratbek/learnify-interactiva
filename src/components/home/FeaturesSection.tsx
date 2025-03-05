
import React from 'react';
import { 
  Brain, 
  Presentation, 
  PenTool, 
  Users,
  Lightbulb,
  BarChart3
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="glassmorphism rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
    <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-foreground/80 text-sm">{description}</p>
  </div>
);

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">How AI Tutor Works</h2>
          <p className="text-foreground/80 md:text-lg max-w-3xl">
            Our platform combines cutting-edge AI with interactive learning techniques to create a personalized educational experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Brain className="h-6 w-6 text-primary" />}
            title="AI-Powered Lessons"
            description="Dynamic content generation tailored to your selected topic and learning style."
          />
          <FeatureCard
            icon={<Presentation className="h-6 w-6 text-primary" />}
            title="Structured Learning"
            description="Lessons follow a logical structure with introductions, explanations, examples, and summaries."
          />
          <FeatureCard
            icon={<PenTool className="h-6 w-6 text-primary" />}
            title="Interactive Whiteboard"
            description="Visual explanations with diagrams and animations to enhance understanding."
          />
          <FeatureCard
            icon={<Lightbulb className="h-6 w-6 text-primary" />}
            title="Adaptive Teaching"
            description="The AI adapts its teaching style based on your interaction and understanding."
          />
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6 text-primary" />}
            title="Progress Tracking"
            description="Monitor your learning journey with detailed progress reports and analytics."
          />
          <FeatureCard
            icon={<Users className="h-6 w-6 text-primary" />}
            title="Personalized Experience"
            description="Create a profile to save your progress and receive personalized recommendations."
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
