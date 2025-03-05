
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
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

  const handleSendMessage = (e: React.FormEvent) => {
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
    setInputValue('');
    
    // Simulate AI thinking and responding (with a slight delay for realism)
    setTimeout(() => {
      // In a real app, this would be the response from your AI backend
      const aiResponse = generateMockResponse(userMessage.content);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Read the response aloud if not muted
      if (!isMuted) {
        speak(aiResponse);
      }
    }, 1000);
  };

  // This is a temporary mock response function that would be replaced with actual AI integration
  const generateMockResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello! How can I help you with your learning today?";
    } else if (input.includes('help')) {
      return "I'm here to help! You can ask me questions about any topic you're learning, request explanations, or even ask for practice problems.";
    } else if (input.includes('learn') || input.includes('teach')) {
      return "I'd be happy to help you learn! What specific topic are you interested in? I can explain concepts, create practice exercises, or provide additional resources.";
    } else if (input.includes('thank')) {
      return "You're welcome! It's my pleasure to assist with your learning journey. Is there anything else you'd like to know?";
    } else if (input.includes('photosynthesis')) {
      return "Photosynthesis is the process by which plants and some other organisms convert light energy, usually from the sun, into chemical energy in the form of glucose. This process provides the oxygen we breathe and is fundamental to most life on Earth. Would you like to know more about a specific aspect of photosynthesis?";
    } else if (input.includes('math') || input.includes('equation') || input.includes('problem')) {
      return "I'd be happy to help with math! Please share the specific problem or concept you're working on, and I'll guide you through it step by step.";
    } else {
      return "That's an interesting question! To provide you with the most accurate information, I would use specialized knowledge about this topic. In a full implementation, I would connect to an AI model to generate a helpful, educational response about " + userInput + ". Is there a specific aspect of this topic you'd like to explore?";
    }
  };

  return (
    <MainLayout requireAuth={true}>
      <div className="container max-w-4xl py-6 space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Chat with Your AI Tutor</h1>
          <p className="text-muted-foreground">
            Ask questions, get explanations, or explore new topics with your personal AI learning assistant.
          </p>
        </div>
        
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
              <div className="ml-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
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
      </div>
    </MainLayout>
  );
};

export default Chat;
