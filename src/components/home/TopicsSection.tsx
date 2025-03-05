
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AtomIcon, 
  BookText, 
  Calculator, 
  Globe, 
  Microscope,
  Music,
  Search,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopicCardProps {
  icon: React.ReactNode;
  color: string;
  title: string;
  description: string;
  onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ icon, color, title, description, onClick }) => (
  <div 
    onClick={onClick}
    className="group relative cursor-pointer glassmorphism rounded-xl p-6 transition-all duration-300 hover:shadow-md"
  >
    <div className={cn("mb-4 rounded-full p-3 w-fit", color)}>
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-foreground/80 text-sm mb-4">{description}</p>
    <ChevronRight className="absolute bottom-6 right-6 h-5 w-5 text-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
  </div>
);

const TopicsSection: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleTopicClick = (topic: string) => {
    navigate(`/lesson?topic=${encodeURIComponent(topic)}`);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/lesson?topic=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Popular Topics</h2>
          <p className="text-foreground/80 md:text-lg max-w-3xl mb-8">
            Choose from our popular topics or search for something specific.
          </p>
          
          <form 
            onSubmit={handleSearch}
            className="flex w-full max-w-lg gap-2"
          >
            <Input
              type="text"
              placeholder="Search for any topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12"
            />
            <Button type="submit" className="h-12">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TopicCard
            icon={<AtomIcon className="h-6 w-6 text-blue-600" />}
            color="bg-blue-100 dark:bg-blue-950/50"
            title="Physics"
            description="Learn about forces, energy, quantum mechanics, and the laws that govern our universe."
            onClick={() => handleTopicClick('Physics')}
          />
          <TopicCard
            icon={<Microscope className="h-6 w-6 text-green-600" />}
            color="bg-green-100 dark:bg-green-950/50"
            title="Biology"
            description="Explore cells, genetics, evolution, and the amazing diversity of life on Earth."
            onClick={() => handleTopicClick('Biology')}
          />
          <TopicCard
            icon={<Calculator className="h-6 w-6 text-purple-600" />}
            color="bg-purple-100 dark:bg-purple-950/50"
            title="Mathematics"
            description="Master algebra, calculus, geometry, and the language of numbers and patterns."
            onClick={() => handleTopicClick('Mathematics')}
          />
          <TopicCard
            icon={<Globe className="h-6 w-6 text-amber-600" />}
            color="bg-amber-100 dark:bg-amber-950/50"
            title="History"
            description="Discover civilizations, revolutions, and the events that shaped our world."
            onClick={() => handleTopicClick('History')}
          />
          <TopicCard
            icon={<BookText className="h-6 w-6 text-red-600" />}
            color="bg-red-100 dark:bg-red-950/50"
            title="Literature"
            description="Analyze classic and modern texts, literary techniques, and the power of storytelling."
            onClick={() => handleTopicClick('Literature')}
          />
          <TopicCard
            icon={<Music className="h-6 w-6 text-cyan-600" />}
            color="bg-cyan-100 dark:bg-cyan-950/50"
            title="Music Theory"
            description="Understand scales, chords, composition, and the mathematics behind beautiful music."
            onClick={() => handleTopicClick('Music Theory')}
          />
        </div>
        
        <div className="flex justify-center mt-10">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/topics')}
            className="group"
          >
            Browse All Topics
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TopicsSection;
