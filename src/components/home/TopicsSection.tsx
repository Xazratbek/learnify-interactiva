
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  AtomIcon, 
  BookText, 
  Calculator, 
  Globe, 
  Microscope,
  Music,
  Search,
  ChevronRight,
  Code,
  Beaker,
  Landmark,
  BookOpen,
  Palette,
  GraduationCap,
  Star,
  Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Topic, getExpandedTopics, getTopicsGroupedByDifficulty } from '@/services/topicService';

interface TopicCardProps {
  icon: React.ReactNode;
  color: string;
  title: string;
  description: string;
  difficulty: string;
  onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ icon, color, title, description, difficulty, onClick }) => {
  const getDifficultyIcon = (level: string) => {
    switch (level) {
      case 'beginner':
        return <Star className="h-3 w-3 mr-1" />;
      case 'intermediate':
        return <GraduationCap className="h-3 w-3 mr-1" />;
      case 'advanced':
        return <Trophy className="h-3 w-3 mr-1" />;
      default:
        return <Star className="h-3 w-3 mr-1" />;
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="group relative cursor-pointer glassmorphism rounded-xl p-6 transition-all duration-300 hover:shadow-md"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn("rounded-full p-3 w-fit", color)}>
          {icon}
        </div>
        <Badge
          className={getDifficultyColor(difficulty)}
          variant="secondary"
        >
          {getDifficultyIcon(difficulty)}
          {difficulty}
        </Badge>
      </div>
      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-foreground/80 text-sm mb-4">{description}</p>
      <ChevronRight className="absolute bottom-6 right-6 h-5 w-5 text-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </div>
  );
};

interface CategoryToIconMap {
  [key: string]: {
    icon: React.ReactNode;
    color: string;
  };
}

const TopicsSection: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [activeCategory, setActiveCategory] = useState('featured');
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [topicsByDifficulty, setTopicsByDifficulty] = useState<{
    beginner: Topic[],
    intermediate: Topic[],
    advanced: Topic[]
  }>({ beginner: [], intermediate: [], advanced: [] });
  
  useEffect(() => {
    // Load expanded topics
    setIsLoading(true);
    const topics = getExpandedTopics();
    setAllTopics(topics);
    setTopicsByDifficulty(getTopicsGroupedByDifficulty());
    setIsLoading(false);
  }, []);
  
  const handleTopicClick = (topic: string) => {
    navigate(`/lesson?topic=${encodeURIComponent(topic)}`);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/lesson?topic=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  // Get unique categories
  const categories = ['featured', ...Array.from(new Set(allTopics.map(topic => topic.category)))];
  
  // Map categories to icons
  const categoryIcons: CategoryToIconMap = {
    'featured': {
      icon: <Star className="h-4 w-4" />,
      color: 'text-amber-600',
    },
    'Programming': {
      icon: <Code className="h-4 w-4" />,
      color: 'text-blue-600',
    },
    'Physics': {
      icon: <AtomIcon className="h-4 w-4" />,
      color: 'text-indigo-600',
    },
    'Mathematics': {
      icon: <Calculator className="h-4 w-4" />,
      color: 'text-purple-600',
    },
    'Biology': {
      icon: <Microscope className="h-4 w-4" />,
      color: 'text-green-600',
    },
    'Chemistry': {
      icon: <Beaker className="h-4 w-4" />,
      color: 'text-red-600',
    },
    'History': {
      icon: <Landmark className="h-4 w-4" />,
      color: 'text-amber-600',
    },
    'Literature': {
      icon: <BookOpen className="h-4 w-4" />,
      color: 'text-emerald-600',
    },
    'Art': {
      icon: <Palette className="h-4 w-4" />,
      color: 'text-pink-600',
    },
    'Music': {
      icon: <Music className="h-4 w-4" />,
      color: 'text-cyan-600',
    },
  };
  
  // Helper function to get topics by category and difficulty
  const getFilteredTopics = () => {
    let filteredTopics = allTopics;
    
    // Filter by category if not featured
    if (activeCategory !== 'featured') {
      filteredTopics = filteredTopics.filter(topic => topic.category === activeCategory);
    } else {
      // For featured, get a selection of topics from different categories
      filteredTopics = allTopics.filter((_, index) => index % 10 === 0).slice(0, 6);
    }
    
    // Filter by difficulty if not all
    if (activeDifficulty !== 'all') {
      filteredTopics = filteredTopics.filter(topic => topic.difficulty === activeDifficulty);
    }
    
    // Limit to 6 topics for display
    return filteredTopics.slice(0, 6);
  };
  
  // Helper to get icon for a specific topic
  const getIconForTopic = (topic: Topic) => {
    const categoryConfig = categoryIcons[topic.category] || {
      icon: <BookText className="h-6 w-6 text-gray-600" />,
      color: 'bg-gray-100 dark:bg-gray-800/50'
    };
    
    return {
      icon: categoryConfig.icon,
      color: topic.category === 'Programming' 
        ? 'bg-blue-100 dark:bg-blue-950/50'
        : topic.category === 'Physics'
        ? 'bg-indigo-100 dark:bg-indigo-950/50'
        : topic.category === 'Mathematics'
        ? 'bg-purple-100 dark:bg-purple-950/50'
        : topic.category === 'Biology'
        ? 'bg-green-100 dark:bg-green-950/50'
        : topic.category === 'Chemistry'
        ? 'bg-red-100 dark:bg-red-950/50'
        : topic.category === 'History'
        ? 'bg-amber-100 dark:bg-amber-950/50'
        : topic.category === 'Literature'
        ? 'bg-emerald-100 dark:bg-emerald-950/50'
        : topic.category === 'Art'
        ? 'bg-pink-100 dark:bg-pink-950/50'
        : topic.category === 'Music'
        ? 'bg-cyan-100 dark:bg-cyan-950/50'
        : 'bg-gray-100 dark:bg-gray-800/50'
    };
  };
  
  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Explore Learning Topics</h2>
          <p className="text-foreground/80 md:text-lg max-w-3xl mb-8">
            Choose from our expanded collection of topics or search for something specific. Our AI tutor will guide you through interactive lessons.
          </p>
          
          <form 
            onSubmit={handleSearch}
            className="flex w-full max-w-lg gap-2 mb-8"
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
          
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <Button 
              variant={activeDifficulty === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveDifficulty('all')}
              className="flex items-center gap-1"
            >
              All Levels
            </Button>
            <Button 
              variant={activeDifficulty === 'beginner' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveDifficulty('beginner')}
              className="flex items-center gap-1"
            >
              <Star className="h-3 w-3" />
              Beginner
            </Button>
            <Button 
              variant={activeDifficulty === 'intermediate' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveDifficulty('intermediate')}
              className="flex items-center gap-1"
            >
              <GraduationCap className="h-3 w-3" />
              Intermediate
            </Button>
            <Button 
              variant={activeDifficulty === 'advanced' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveDifficulty('advanced')}
              className="flex items-center gap-1"
            >
              <Trophy className="h-3 w-3" />
              Advanced
            </Button>
          </div>
          
          <Tabs
            defaultValue="featured"
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="flex items-center gap-2">
                  {categoryIcons[category]?.icon || <BookText className="h-4 w-4" />}
                  <span>{category}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="h-64 rounded-xl animate-pulse bg-muted" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredTopics().map((topic) => {
                    const { icon, color } = getIconForTopic(topic);
                    return (
                      <TopicCard
                        key={topic.id}
                        icon={icon}
                        color={color}
                        title={topic.title}
                        description={topic.description}
                        difficulty={topic.difficulty}
                        onClick={() => handleTopicClick(topic.title)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </Tabs>
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
