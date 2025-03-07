
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  GraduationCap,
  BarChart,
  Settings,
  Search,
  Clock,
  Star,
  Layers,
  PlayCircle,
  MessageCircle,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { getSuggestedTopics, searchTopics, Topic } from '@/services/topicService';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('progress');
  const [courses, setCourses] = useState<any[]>([]);
  const [recentLessons, setRecentLessons] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Topic[]>([]);
  const [suggestedTopics, setSuggestedTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's courses and recent lessons
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        // Fetch lesson progress
        const { data: progressData, error: progressError } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', user.id)
          .order('last_accessed', { ascending: false });

        if (progressError) throw progressError;

        // Set recent lessons based on progress data
        setRecentLessons(progressData || []);

        // Load suggested topics
        const topics = await getSuggestedTopics();
        setSuggestedTopics(topics);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load your learning data');
      }
    };

    fetchUserData();
  }, [user]);

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchTopics(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching topics:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to lesson
  const handleStartLesson = (topic: string) => {
    navigate(`/lesson?topic=${encodeURIComponent(topic)}`);
  };

  // For chat with AI
  const handleChatWithAI = () => {
    navigate('/chat');
  };

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

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Learning Dashboard</h1>
            <p className="text-muted-foreground">
              Track your progress and continue your learning journey
            </p>
          </div>
          <Button onClick={handleChatWithAI} className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Chat with AI Tutor
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Learning Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Progress</span>
                    <span className="font-medium">
                      {recentLessons.length > 0 ? Math.floor(recentLessons.reduce((sum, lesson) => sum + lesson.completion_percentage, 0) / recentLessons.length) : 0}%
                    </span>
                  </div>
                  <Progress value={recentLessons.length > 0 ? Math.floor(recentLessons.reduce((sum, lesson) => sum + lesson.completion_percentage, 0) / recentLessons.length) : 0} className="h-2" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Lessons Completed</span>
                  <Badge variant="outline">{recentLessons.filter(lesson => lesson.completion_percentage >= 90).length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Lessons In Progress</span>
                  <Badge variant="outline">{recentLessons.filter(lesson => lesson.completion_percentage < 90 && lesson.completion_percentage > 0).length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentLessons.length > 0 ? (
                <div className="space-y-3">
                  {recentLessons.slice(0, 3).map((lesson, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Layers className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{lesson.topic}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(lesson.last_accessed).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Progress value={lesson.completion_percentage} className="w-16 h-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No recent activity</p>
                  <p className="text-sm mt-1">Start a lesson to track your progress</p>
                </div>
              )}
            </CardContent>
            {recentLessons.length > 0 && (
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="w-full justify-between group" onClick={() => setActiveTab('progress')}>
                  View All Activities
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            )}
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Recommended for You
              </CardTitle>
            </CardHeader>
            <CardContent>
              {suggestedTopics.length > 0 ? (
                <div className="space-y-3">
                  {suggestedTopics.slice(0, 3).map((topic, i) => (
                    <div key={i} className="flex justify-between items-center group">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Star className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium group-hover:text-primary transition-colors">
                            {topic.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{topic.category}</p>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleStartLesson(topic.title)}
                      >
                        <PlayCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>Loading recommendations...</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="w-full justify-between group" onClick={() => setActiveTab('explore')}>
                Explore All Topics
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="progress" className="flex gap-2">
              <BarChart className="h-4 w-4" />
              My Progress
            </TabsTrigger>
            <TabsTrigger value="explore" className="flex gap-2">
              <Search className="h-4 w-4" />
              Explore Topics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Learning Progress</CardTitle>
                <CardDescription>
                  Track all your lessons and completed courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentLessons.length > 0 ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Recent Lessons</h3>
                      <div className="space-y-4">
                        {recentLessons.map((lesson, i) => (
                          <div key={i} className="flex items-center justify-between border-b pb-3">
                            <div>
                              <h4 className="font-medium">{lesson.topic}</h4>
                              <p className="text-sm text-muted-foreground">
                                Last accessed: {new Date(lesson.last_accessed).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-32">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Progress</span>
                                  <span>{lesson.completion_percentage}%</span>
                                </div>
                                <Progress value={lesson.completion_percentage} className="h-2" />
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleStartLesson(lesson.topic)}
                              >
                                Continue
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No lessons started yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start learning by exploring topics and beginning your first lesson
                    </p>
                    <Button onClick={() => setActiveTab('explore')}>
                      Explore Topics
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="explore" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Explore Learning Topics</CardTitle>
                <CardDescription>
                  Discover new subjects and expand your knowledge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2 mb-6">
                  <Input
                    type="text"
                    placeholder="Search for any topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Searching...' : 'Search'}
                  </Button>
                </form>

                {searchResults.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Search Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.map((topic) => (
                        <Card key={topic.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-lg">{topic.title}</CardTitle>
                              <Badge
                                className={getDifficultyColor(topic.difficulty)}
                                variant="secondary"
                              >
                                {topic.difficulty}
                              </Badge>
                            </div>
                            <CardDescription>{topic.category}</CardDescription>
                          </CardHeader>
                          <CardContent className="pb-0">
                            <p className="text-sm text-muted-foreground">
                              {topic.description}
                            </p>
                          </CardContent>
                          <CardFooter className="pt-4">
                            <Button
                              variant="default"
                              className="w-full"
                              onClick={() => handleStartLesson(topic.title)}
                            >
                              Start Learning
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium mb-4">Suggested Topics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestedTopics.map((topic) => (
                      <Card key={topic.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle className="text-lg">{topic.title}</CardTitle>
                            <Badge
                              className={getDifficultyColor(topic.difficulty)}
                              variant="secondary"
                            >
                              {topic.difficulty}
                            </Badge>
                          </div>
                          <CardDescription>{topic.category}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-0">
                          <p className="text-sm text-muted-foreground">
                            {topic.description}
                          </p>
                        </CardContent>
                        <CardFooter className="pt-4">
                          <Button
                            variant="default"
                            className="w-full"
                            onClick={() => handleStartLesson(topic.title)}
                          >
                            Start Learning
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and learning settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Profile Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input value={user?.email || ''} disabled />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Learning Preferences</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Default Learning Style</label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                          <option value="visual">Visual</option>
                          <option value="auditory">Auditory</option>
                          <option value="reading">Reading/Writing</option>
                          <option value="kinesthetic">Kinesthetic</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={() => toast.success("Settings saved!")}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
