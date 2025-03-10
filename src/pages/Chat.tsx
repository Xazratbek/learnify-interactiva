
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ChatContainer from '@/components/chat/ChatContainer';
import WhiteboardContainer from '@/components/chat/WhiteboardContainer';
import { useTextToSpeech } from '@/components/chat/useTextToSpeech';
import { generateGeminiResponse, GeminiMessage } from '@/services/gemini';
import { saveConversation, getConversationHistory } from '@/services/gemini/storage';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  drawingInstructions?: any[];
  isFollowUpQuestion?: boolean;
}

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

const Chat = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("chat");
  const [geminiHistory, setGeminiHistory] = useState<GeminiMessage[]>([]);
  const [whiteboardData, setWhiteboardData] = useState<any>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>(Date.now().toString());
  const [currentChatTitle, setCurrentChatTitle] = useState<string>("New Chat");
  
  const { isSpeaking, isMuted, speak, toggleMute } = useTextToSpeech();

  // Load chat history when the component mounts
  useEffect(() => {
    if (user?.id) {
      loadChatHistory();
    }
  }, [user?.id]);

  // Show welcome message when starting a new chat
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `Hello ${user?.email || 'there'}! I'm your AI learning assistant. What topic would you like to explore today? You can ask me to teach you about any subject, like "Teach me web development basics" or "What happens when I type a URL in the browser?". I can also create visual explanations on the whiteboard.`,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
      setGeminiHistory([
        {
          role: 'model' as const,
          parts: [{ text: welcomeMessage.content }]
        }
      ]);
      
      if (!isMuted) {
        speak(welcomeMessage.content);
      }
    }
  }, [messages.length, user?.email, isMuted, speak]);

  const loadChatHistory = async () => {
    if (!user?.id) return;
    
    try {
      const conversations = await getConversationHistory(user.id);
      
      // Format the conversations as Chat objects
      const formattedChats: Chat[] = conversations.map((conv: any) => {
        // Get messages from the Gemini message format
        const chatMessages: Message[] = [];
        for (let i = 0; i < conv.messages.length; i++) {
          const msg = conv.messages[i];
          if (msg.parts && msg.parts.length > 0) {
            chatMessages.push({
              id: `${conv.id}-${i}`,
              content: msg.parts[0].text,
              sender: msg.role === 'user' ? 'user' : 'ai',
              timestamp: new Date(conv.created_at)
            });
          }
        }
        
        // Generate a title from the first few messages
        const firstUserMessage = chatMessages.find(m => m.sender === 'user')?.content || '';
        const title = firstUserMessage.length > 0
          ? firstUserMessage.substring(0, 30) + (firstUserMessage.length > 30 ? '...' : '')
          : `Chat ${new Date(conv.created_at).toLocaleDateString()}`;
        
        return {
          id: conv.id,
          title: title,
          timestamp: new Date(conv.created_at),
          messages: chatMessages
        };
      });
      
      setChatHistory(formattedChats);
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const handleStartNewChat = () => {
    setMessages([]);
    setGeminiHistory([]);
    setWhiteboardData(null);
    setCurrentChatId(Date.now().toString());
    setCurrentChatTitle("New Chat");
  };

  const handleSelectChat = (chatId: string) => {
    const selectedChat = chatHistory.find(chat => chat.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
      
      // Rebuild Gemini history from the messages
      const newGeminiHistory: GeminiMessage[] = selectedChat.messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: msg.content }]
      }));
      
      setGeminiHistory(newGeminiHistory);
      setCurrentChatId(chatId);
      setCurrentChatTitle(selectedChat.title);
      
      // Load whiteboard data if any exists
      const lastDrawingMsg = selectedChat.messages.find(msg => msg.drawingInstructions && msg.drawingInstructions.length > 0);
      if (lastDrawingMsg?.drawingInstructions) {
        setWhiteboardData(lastDrawingMsg.drawingInstructions);
      }
    }
  };

  const handleSendMessage = async (messageContent: string) => {
    // Add user message to the UI
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsAiThinking(true);
    
    // Update the chat title if this is the first user message
    if (currentChatTitle === "New Chat" && messages.length <= 1) {
      // Use the first ~30 chars of the user's message as the title
      const newTitle = messageContent.length > 30 
        ? messageContent.substring(0, 30) + '...' 
        : messageContent;
      setCurrentChatTitle(newTitle);
    }
    
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
      const updatedHistory: GeminiMessage[] = [
        ...geminiHistory,
        { role: 'user' as const, parts: [{ text: messageContent }] }
      ];
      
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
      const finalMessages = [...updatedMessages, aiResponse];
      setMessages(finalMessages);
      
      // Update Gemini conversation history
      const finalHistory: GeminiMessage[] = [
        ...updatedHistory,
        { role: 'model' as const, parts: [{ text: geminiResponse.text }] }
      ];
      setGeminiHistory(finalHistory);
      
      // Save the conversation to the database
      if (user?.id) {
        await saveConversation(user.id, finalHistory);
        loadChatHistory(); // Refresh chat history
      }
      
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
          
          const messagesWithFollowUp = [...finalMessages, followUpMessage];
          setMessages(messagesWithFollowUp);
          
          const historyWithFollowUp: GeminiMessage[] = [
            ...finalHistory,
            { role: 'model' as const, parts: [{ text: geminiResponse.followUpQuestion! }] }
          ];
          setGeminiHistory(historyWithFollowUp);
          
          // Save updated conversation with follow-up
          if (user?.id) {
            saveConversation(user.id, historyWithFollowUp)
              .then(() => loadChatHistory());
          }
          
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
              chatHistory={chatHistory}
              onNewChat={handleStartNewChat}
              onSelectChat={handleSelectChat}
              currentChatTitle={currentChatTitle}
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
