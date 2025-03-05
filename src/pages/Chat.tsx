
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Mic, MicOff, Volume2, VolumeX, PenLine } from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { generateAIResponse } from '@/services/lessonService';
import Whiteboard from '@/components/lesson/WhiteboardInteractive';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  drawingInstructions?: any[];
}

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [whiteboardData, setWhiteboardData] = useState<any>(null);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<SpeechRecognition | null>(null);
  const synth = useRef(window.speechSynthesis);

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
    
    return () => {
      synth.current.cancel(); // Cancel any ongoing speech when component unmounts
    };
  }, [user?.email, isMuted]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      
      recognition.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        
        setInputValue(transcript);
      };
      
      recognition.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast.error("Speech recognition failed. Please try again or use text input.");
      };
    } else {
      toast.error("Your browser doesn't support speech recognition. Please use text input instead.");
    }
    
    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition.current) {
      toast.error("Speech recognition is not available in your browser.");
      return;
    }
    
    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      setInputValue('');
      recognition.current.start();
      setIsListening(true);
    }
  };

  const speak = (text: string) => {
    if (isMuted) return;
    
    // Cancel any ongoing speech
    synth.current.cancel();
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    
    // Use a voice that sounds good (optional)
    const voices = synth.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || voice.name.includes('Female') || voice.name.includes('UK')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    // Speak the text
    synth.current.speak(utterance);
  };

  const toggleMute = () => {
    if (isSpeaking && !isMuted) {
      synth.current.cancel();
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, { role: 'user', content: userMessage.content }]);
    setInputValue('');
    
    try {
      // Generate AI response using the service
      const aiResponseData = await generateAIResponse(
        user?.id || '',
        userMessage.content,
        conversationHistory
      );
      
      // Check if the response contains drawing instructions
      let aiResponse: Message;
      
      if (typeof aiResponseData === 'object' && aiResponseData.text) {
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
          content: aiResponseData,
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
    // Here we would save the whiteboard data to Supabase
    console.log("Updated whiteboard data:", newData);
    // In a real implementation, you would call a service function here
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
            <Card className="min-h-[70vh] flex flex-col">
              <CardHeader className="px-6 py-4 border-b">
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="h-8 w-8 bg-primary">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    {isSpeaking && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                  </div>
                  AI Learning Assistant
                  <div className="ml-auto flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setActiveTab("whiteboard")}
                      title="Open Whiteboard"
                    >
                      <PenLine className="h-5 w-5" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 p-6 overflow-hidden">
                <ScrollArea className="h-[calc(70vh-13rem)]" ref={scrollAreaRef}>
                  <div className="flex flex-col space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3 max-w-[80%]",
                          message.sender === 'user' ? "ml-auto" : ""
                        )}
                      >
                        {message.sender === 'ai' && (
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              AI
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div
                          className={cn(
                            "rounded-lg px-4 py-2 text-sm",
                            message.sender === 'user'
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          {message.drawingInstructions && (
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="p-0 h-auto mt-1 text-xs"
                              onClick={() => setActiveTab("whiteboard")}
                            >
                              View on Whiteboard
                            </Button>
                          )}
                          <p className="text-xs mt-1 opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        
                        {message.sender === 'user' && (
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback>
                              {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              
              <CardFooter className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
                  <Button
                    type="button"
                    variant={isListening ? "default" : "outline"}
                    size="icon"
                    onClick={toggleListening}
                    className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  
                  <Input
                    placeholder={isListening ? "Listening..." : "Type your message..."}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1"
                    disabled={isListening}
                  />
                  
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="whiteboard" className="mt-0">
            <Card className="min-h-[70vh] flex flex-col">
              <CardHeader className="px-6 py-4 border-b">
                <CardTitle className="text-xl flex items-center gap-2">
                  Interactive Whiteboard
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={() => setActiveTab("chat")}
                  >
                    Back to Chat
                  </Button>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 p-6 overflow-hidden flex justify-center items-center">
                <Whiteboard 
                  initialData={whiteboardData}
                  onDataUpdate={handleWhiteboardDataUpdate}
                  readOnly={false}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Chat;
