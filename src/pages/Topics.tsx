
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  Book, 
  PlayCircle, 
  ChevronRight, 
  Lightbulb, 
  Atom, 
  Calculator, 
  Globe, 
  Microscope, 
  BookText, 
  Music, 
  GraduationCap,
  Star,
  Trophy,
  Code,
  Beaker,
  Palette,
  Landmark
} from 'lucide-react';
import { toast } from 'sonner';
import { getSuggestedTopics, searchTopics, Topic, getTopicsByDifficulty, getTopicsGroupedByDifficulty } from '@/services/topicService';

const categories = [
  { name: 'All', icon: Book },
  { name: 'Programming', icon: Code },
  { name: 'Physics', icon: Atom },
  { name: 'Mathematics', icon: Calculator },
  { name: 'History', icon: Landmark },
  { name: 'Biology', icon: Microscope },
  { name: 'Chemistry', icon: Beaker },
  { name: 'Literature', icon: BookText },
  { name: 'Art', icon: Palette },
  { name: 'Music', icon: Music },
];

const difficultyIcons = {
  beginner: Star,
  intermediate: GraduationCap,
  advanced: Trophy
};

interface TopicCardProps {
  topic: Topic; 
  onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  const DifficultyIcon = difficultyIcons[topic.difficulty as keyof typeof difficultyIcons] || Star;

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {topic.title}
          </CardTitle>
          <Badge
            className={getDifficultyColor(topic.difficulty)}
            variant="secondary"
          >
            <DifficultyIcon className="h-3 w-3 mr-1" />
            {topic.difficulty}
          </Badge>
        </div>
        <CardDescription>{topic.category}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          {topic.description}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          className="w-full"
          onClick={onClick}
        >
          Start Learning
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const TopicsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [topicsByDifficulty, setTopicsByDifficulty] = useState<{
    beginner: Topic[],
    intermediate: Topic[],
    advanced: Topic[]
  }>({ beginner: [], intermediate: [], advanced: [] });

  // Load topics on component mount
  useEffect(() => {
    const loadTopics = async () => {
      setIsLoading(true);
      try {
        const suggestedTopics = await getSuggestedTopics();
        setTopics(suggestedTopics);
        setFilteredTopics(suggestedTopics);
        
        // Group topics by difficulty
        setTopicsByDifficulty({
          beginner: suggestedTopics.filter(t => t.difficulty === 'beginner'),
          intermediate: suggestedTopics.filter(t => t.difficulty === 'intermediate'),
          advanced: suggestedTopics.filter(t => t.difficulty === 'advanced')
        });
      } catch (error) {
        console.error('Error loading topics:', error);
        toast.error('Failed to load topics. Please try again.');
        
        // Fallback to static data if API fails
        const staticTopics = getTopicsByDifficulty('all');
        setTopics(staticTopics);
        setFilteredTopics(staticTopics);
        setTopicsByDifficulty(getTopicsGroupedByDifficulty());
      } finally {
        setIsLoading(false);
      }
    };

    loadTopics();
  }, []);

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      // Reset to suggested topics if search is empty
      setFilteredTopics(topics);
      return;
    }
    
    setIsLoading(true);
    try {
      const results = await searchTopics(searchQuery);
      setFilteredTopics(results);
    } catch (error) {
      console.error('Error searching topics:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter topics based on category and difficulty
  useEffect(() => {
    let filtered = [...topics];
    
    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(topic => 
        topic.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    
    // Filter by difficulty
    if (activeDifficulty !== 'all') {
      filtered = filtered.filter(topic => 
        topic.difficulty === activeDifficulty
      );
    }
    
    setFilteredTopics(filtered);
  }, [activeCategory, activeDifficulty, topics]);

  // Start a lesson
  const handleStartLesson = (topic: string) => {
    navigate(`/lesson?topic=${encodeURIComponent(topic)}`);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Explore Topics</h1>
            <p className="text-muted-foreground">
              Discover new subjects and expand your knowledge
            </p>
          </div>
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="mt-4 md:mt-0"
          >
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <form onSubmit={handleSearch} className="flex w-full gap-2 mb-6">
              <Input
                type="text"
                placeholder="Search for any topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10"
              />
              <Button type="submit" className="h-10">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </div>
          
          <div className="lg:col-span-1">
            <div className="flex flex-col space-y-4">
              <div>
                <div className="flex items-center gap-2 font-medium text-sm mb-2">
                  <Filter className="h-4 w-4" />
                  Difficulty Level
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={activeDifficulty === 'all' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveDifficulty('all')}
                    className="w-full"
                  >
                    All
                  </Button>
                  <Button 
                    variant={activeDifficulty === 'beginner' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveDifficulty('beginner')}
                    className="w-full"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Beginner
                  </Button>
                  <Button 
                    variant={activeDifficulty === 'intermediate' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveDifficulty('intermediate')}
                    className="w-full"
                  >
                    <GraduationCap className="h-3 w-3 mr-1" />
                    Inter.
                  </Button>
                  <Button 
                    variant={activeDifficulty === 'advanced' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveDifficulty('advanced')}
                    className="w-full"
                    className="col-span-3"
                  >
                    <Trophy className="h-3 w-3 mr-1" />
                    Advanced
                  </Button>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 font-medium text-sm mb-2">
                  <Book className="h-4 w-4" />
                  Topic Counts
                </div>
                <div className="bg-muted rounded-md p-3 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="flex items-center"><Star className="h-3 w-3 mr-1 text-green-500" /> Beginner:</span>
                    <span>{topicsByDifficulty.beginner.length}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="flex items-center"><GraduationCap className="h-3 w-3 mr-1 text-blue-500" /> Intermediate:</span>
                    <span>{topicsByDifficulty.intermediate.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center"><Trophy className="h-3 w-3 mr-1 text-purple-500" /> Advanced:</span>
                    <span>{topicsByDifficulty.advanced.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-4 flex-wrap h-auto p-1">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.name}
                value={category.name.toLowerCase()}
                onClick={() => setActiveCategory(category.name)}
                className="flex items-center gap-1"
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <Separator className="mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="h-64 animate-pulse">
                  <CardHeader>
                    <div className="h-5 w-2/3 bg-muted rounded"></div>
                    <div className="h-4 w-1/3 bg-muted rounded mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-full bg-muted rounded mb-2"></div>
                    <div className="h-4 w-5/6 bg-muted rounded mb-2"></div>
                    <div className="h-4 w-4/6 bg-muted rounded"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-10 w-full bg-muted rounded"></div>
                  </CardFooter>
                </Card>
              ))
            ) : filteredTopics.length > 0 ? (
              filteredTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onClick={() => handleStartLesson(topic.title)}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No topics found</h3>
                <p className="text-muted-foreground mb-4">
                  Try a different search term or category filter
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                    setActiveDifficulty('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </Tabs>

        <div className="flex justify-center">
          <Button 
            onClick={() => navigate('/chat')}
            size="lg"
            className="flex items-center gap-2"
          >
            <PlayCircle className="h-5 w-5" />
            Chat with AI Tutor
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default TopicsPage;
