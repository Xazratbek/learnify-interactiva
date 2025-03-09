
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import LessonContent from '@/components/lesson/LessonContent';
import AIChat from '@/components/lesson/AIChat';
import Whiteboard from '@/components/lesson/Whiteboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft,
  BookText, 
  MessageCircle, 
  PenTool, 
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const Lesson = () => {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get('topic') || 'General Knowledge';
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'lesson' | 'chat' | 'whiteboard'>('lesson');
  const [whiteboardData, setWhiteboardData] = useState<any[]>([]);
  
  // Handle drawing instructions from AI chat
  const handleDrawingInstructions = useCallback((instructions: any[]) => {
    setWhiteboardData(instructions);
    toast.info(
      "The AI tutor has created a visual explanation!", 
      {
        description: "Click the Whiteboard tab to view it",
        action: {
          label: "View",
          onClick: () => setActiveTab('whiteboard')
        }
      }
    );
  }, []);
  
  useEffect(() => {
    // Show welcome toast when lesson loads
    toast(`Starting lesson on ${topic}`, {
      description: "Use the tabs to switch between lesson content, chat, and whiteboard",
      position: "top-center",
      icon: <Sparkles className="h-4 w-4 text-primary" />
    });
  }, [topic]);
  
  return (
    <MainLayout>
      <div className="container px-4 py-8 max-w-6xl">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(-1)}
                className="rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {topic}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => toast.success("Lesson saved to your profile")}
              >
                Save Lesson
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-2/3 space-y-6">
              <Card className="glassmorphism p-1 flex items-center justify-center md:justify-start overflow-x-auto">
                <Button
                  variant={activeTab === 'lesson' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('lesson')}
                  className="flex gap-2"
                >
                  <BookText className="h-4 w-4" />
                  <span className="whitespace-nowrap">Lesson</span>
                </Button>
                <Button
                  variant={activeTab === 'chat' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('chat')}
                  className="flex gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="whitespace-nowrap">Chat</span>
                </Button>
                <Button
                  variant={activeTab === 'whiteboard' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('whiteboard')}
                  className="flex gap-2"
                >
                  <PenTool className="h-4 w-4" />
                  <span className="whitespace-nowrap">Whiteboard</span>
                </Button>
              </Card>
              
              <div className="md:hidden">
                {activeTab === 'lesson' && <LessonContent topic={topic} />}
                {activeTab === 'chat' && <AIChat topic={topic} onDrawingInstructions={handleDrawingInstructions} />}
                {activeTab === 'whiteboard' && <Whiteboard />}
              </div>
              
              <div className="hidden md:block">
                <LessonContent topic={topic} className={activeTab !== 'lesson' ? 'hidden' : ''} />
                <AIChat 
                  topic={topic} 
                  className={activeTab !== 'chat' ? 'hidden' : ''} 
                  onDrawingInstructions={handleDrawingInstructions}
                />
                <Whiteboard 
                  className={activeTab !== 'whiteboard' ? 'hidden' : ''} 
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/3 hidden md:block">
              <AIChat 
                topic={topic} 
                onDrawingInstructions={handleDrawingInstructions}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Lesson;
