
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TopicsSection from '@/components/home/TopicsSection';
import TestimonialSection from '@/components/home/TestimonialSection';
import CTASection from '@/components/home/CTASection';

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <TopicsSection />
      <TestimonialSection />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
