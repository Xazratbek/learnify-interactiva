
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TopicsSection from '@/components/home/TopicsSection';
import TestimonialSection from '@/components/home/TestimonialSection';
import CTASection from '@/components/home/CTASection';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <TopicsSection />
      <TestimonialSection />
      
      {user && (
        <div className="container py-8 flex justify-center">
          <Button size="lg" asChild className="animate-pulse-soft">
            <Link to="/chat" className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chat with AI Tutor
            </Link>
          </Button>
        </div>
      )}
      
      <CTASection />
    </MainLayout>
  );
};

export default Index;
