
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { generateAIResponse } from '@/services/lessonService';
import { toast } from 'sonner';
import ChatContainer from '@/components/chat/ChatContainer';
import WhiteboardContainer from '@/components/chat/WhiteboardContainer';
import { useTextToSpeech } from '@/components/chat/useTextToSpeech';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  drawingInstructions?: any[];
}

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState("chat");
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [whiteboardData, setWhiteboardData] = useState<any>(null);
  
  const { isSpeaking, isMuted, speak, toggleMute } = useTextToSpeech();

  // Generate a welcome message when the component mounts
  useEffect(() => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: `Hello ${user?.email || 'there'}! I'm your AI learning assistant. How can I help you today?`,
      sender: 'ai',
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
    setConversationHistory([{ role: 'assistant', content: welcomeMessage.content }]);
    
    if (!isMuted) {
      speak(welcomeMessage.content);
    }
  }, [user?.email, isMuted, speak]);

  const handleSendMessage = async (messageContent: string) => {
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, { role: 'user', content: userMessage.content }]);
    
    try {
      // Generate AI response using the service
      const aiResponseData = await generateAIResponse(
        user?.id || '',
        userMessage.content,
        conversationHistory
      );
      
      // Check if the response contains drawing instructions
      let aiResponse: Message;
      
      if (typeof aiResponseData === 'object' && 'text' in aiResponseData) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: aiResponseData.text,
          sender: 'ai',
          timestamp: new Date(),
          drawingInstructions: aiResponseData.drawingInstructions
        };
        
        // If there are drawing instructions, show the whiteboard tab
        if (aiResponseData.drawingInstructions && aiResponseData.drawingInstructions.length > 0) {
          setWhiteboardData(aiResponseData.drawingInstructions);
          // Switch to whiteboard tab after a small delay
          setTimeout(() => setActiveTab("whiteboard"), 1000);
        }
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: aiResponseData as string,
          sender: 'ai',
          timestamp: new Date(),
        };
      }
      
      setMessages(prev => [...prev, aiResponse]);
      setConversationHistory(prev => [...prev, { role: 'assistant', content: aiResponse.content }]);
      
      // Read the response aloud if not muted
      if (!isMuted) {
        speak(aiResponse.content);
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast.error("Failed to get AI response. Please try again.");
    }
  };

  const handleWhiteboardDataUpdate = (newData: any) => {
    console.log("Updated whiteboard data:", newData);
    // In a real implementation, you would call a service function here
  };

  const handleViewWhiteboard = () => {
    setActiveTab("whiteboard");
  };

  const handleBackToChat = () => {
    setActiveTab("chat");
  };

  return (
    <MainLayout requireAuth={true}>
      <div className="container max-w-5xl py-6 space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Interactive Learning Assistant</h1>
          <p className="text-muted-foreground">
            Ask questions, get explanations, or explore new topics with your personal AI tutor. The AI can also create visual explanations on the whiteboard.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-[400px] mx-auto mb-4">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="mt-0">
            <ChatContainer 
              messages={messages}
              onSendMessage={handleSendMessage}
              onViewWhiteboard={handleViewWhiteboard}
              isSpeaking={isSpeaking}
              isMuted={isMuted}
              onToggleMute={toggleMute}
            />
          </TabsContent>
          
          <TabsContent value="whiteboard" className="mt-0">
            <WhiteboardContainer 
              whiteboardData={whiteboardData}
              onDataUpdate={handleWhiteboardDataUpdate}
              onBackToChat={handleBackToChat}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Chat;
