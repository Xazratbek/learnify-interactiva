import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ChatContainer from '@/components/chat/ChatContainer';
import WhiteboardContainer from '@/components/chat/WhiteboardContainer';
import { useTextToSpeech } from '@/components/chat/useTextToSpeech';
import { generateGeminiResponse, GeminiMessage } from '@/services/gemini';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  drawingInstructions?: any[];
  isFollowUpQuestion?: boolean;
}

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState("chat");
  const [geminiHistory, setGeminiHistory] = useState<GeminiMessage[]>([]);
  const [whiteboardData, setWhiteboardData] = useState<any>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  const { isSpeaking, isMuted, speak, toggleMute } = useTextToSpeech();

  useEffect(() => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: `Hello ${user?.email || 'there'}! I'm your AI learning assistant. What topic would you like to explore today? You can ask me to teach you about any subject, like "Teach me web development basics" or "What happens when I type a URL in the browser?". I can also create visual explanations on the whiteboard.`,
      sender: 'ai',
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
    setGeminiHistory([
      {
        role: 'model',
        parts: [{ text: welcomeMessage.content }]
      }
    ]);
    
    if (!isMuted) {
      speak(welcomeMessage.content);
    }
  }, [user?.email, isMuted, speak]);

  const handleSendMessage = async (messageContent: string) => {
    // Add user message to the UI
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsAiThinking(true);
    
    try {
      // Process common learning requests
      const lowerMessage = messageContent.toLowerCase();
      let enhancedPrompt = messageContent;
      
      if (lowerMessage.includes('teach me') || lowerMessage.includes('explain') || lowerMessage.includes('how does') || lowerMessage.includes('what is')) {
        if (lowerMessage.includes('url') || lowerMessage.includes('browser') || lowerMessage.includes('web')) {
          enhancedPrompt += " Please include a visual explanation with drawing instructions to illustrate the process.";
        }
      }
      
      // Generate AI response using Gemini
      const geminiResponse = await generateGeminiResponse(
        enhancedPrompt,
        geminiHistory
      );
      
      // Create the AI response message
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: geminiResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        drawingInstructions: geminiResponse.drawingInstructions
      };
      
      // Update messages state with AI response
      setMessages(prev => [...prev, aiResponse]);
      
      // Update Gemini conversation history
      setGeminiHistory(prev => [
        ...prev,
        { role: 'user', parts: [{ text: messageContent }] },
        { role: 'model', parts: [{ text: geminiResponse.text }] }
      ]);
      
      // If there are drawing instructions, update whiteboard data and switch to it
      if (geminiResponse.drawingInstructions && geminiResponse.drawingInstructions.length > 0) {
        setWhiteboardData(geminiResponse.drawingInstructions);
        toast.info("Visual explanation created! Check the whiteboard tab to see it.", {
          duration: 5000,
          action: {
            label: "View",
            onClick: () => setActiveTab("whiteboard")
          }
        });
      }
      
      // Speak the AI response if text-to-speech is enabled
      if (!isMuted) {
        speak(geminiResponse.text);
      }
      
      // If there's a follow-up question, send it after a delay
      if (geminiResponse.shouldAskFollowUp && geminiResponse.followUpQuestion) {
        setTimeout(() => {
          const followUpMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: geminiResponse.followUpQuestion!,
            sender: 'ai',
            timestamp: new Date(),
            isFollowUpQuestion: true
          };
          
          setMessages(prev => [...prev, followUpMessage]);
          setGeminiHistory(prev => [
            ...prev,
            { role: 'model', parts: [{ text: geminiResponse.followUpQuestion! }] }
          ]);
          
          if (!isMuted) {
            speak(geminiResponse.followUpQuestion!);
          }
        }, 5000); // Wait 5 seconds before asking the follow-up
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleWhiteboardDataUpdate = (newData: any) => {
    console.log("Updated whiteboard data:", newData);
    setWhiteboardData(newData);
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
            Ask questions, get explanations, or explore new topics with your personal AI tutor. You can request step-by-step lessons on any topic, and the AI can create visual explanations on the whiteboard.
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
              isAiThinking={isAiThinking}
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
