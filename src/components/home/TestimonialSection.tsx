
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
  avatar?: string;
  delay: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, name, title, avatar, delay }) => (
  <Card className="glassmorphism border-none animate-fade-in" style={{ animationDelay: delay }}>
    <CardContent className="pt-6">
      <Quote className="h-8 w-8 text-primary/30 mb-4" />
      <p className="text-foreground/80 mb-6 italic">"{quote}"</p>
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-sm text-foreground/60">{title}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const TestimonialSection: React.FC = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">What Our Users Say</h2>
          <p className="text-foreground/80 md:text-lg max-w-3xl">
            Discover how AI Tutor is transforming the learning experience for students around the world.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Testimonial
            quote="The interactive whiteboard feature helped me visualize complex physics concepts that I've been struggling with for months. It's like having a personal tutor available 24/7."
            name="Alex Johnson"
            title="High School Student"
            delay="0ms"
          />
          <Testimonial
            quote="As a teacher, I recommend AI Tutor to my students for additional practice. The personalized feedback and adaptive teaching style keeps them engaged and accelerates their learning."
            name="Sarah Miller"
            title="Math Teacher"
            delay="100ms"
          />
          <Testimonial
            quote="I've always struggled with traditional learning methods. AI Tutor adapts to my learning style and pace, making complex subjects more accessible than ever before."
            name="Michael Chen"
            title="College Student"
            delay="200ms"
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
