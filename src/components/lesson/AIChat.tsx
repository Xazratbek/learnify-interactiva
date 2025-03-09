import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateGeminiResponse, GeminiMessage } from '@/services/geminiService';
import { toast } from 'sonner';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  drawingInstructions?: any[];
}

interface AIChatProps {
  topic: string;
  className?: string;
  onDrawingInstructions?: (instructions: any[]) => void;
}

const AIChat: React.FC<AIChatProps> = ({ topic, className, onDrawingInstructions }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  useEffect(() => {
    setIsLoading(true);
    
    const initialPrompt = `You are a tutor helping a student learn about ${topic}. 
    Provide a friendly, engaging introduction to this topic (1-2 paragraphs). 
    Mention 2-3 key aspects you'll cover and ask if they have any specific questions.
    If appropriate, create a simple visual diagram using drawing instructions.`;

    generateGeminiResponse(initialPrompt)
      .then(response => {
        const aiMessage: Message = {
          role: 'assistant',
          content: response.text,
          timestamp: new Date(),
          drawingInstructions: response.drawingInstructions
        };
        
        setMessages([aiMessage]);
        
        if (response.drawingInstructions && onDrawingInstructions) {
          onDrawingInstructions(response.drawingInstructions);
        }
      })
      .catch(error => {
        console.error('Error generating initial message:', error);
        setMessages([{
          role: 'assistant',
          content: `Welcome to your lesson on ${topic}! I'm your AI tutor, and I'm here to help you understand this topic step by step. What specific aspects of ${topic} would you like to explore today?`,
          timestamp: new Date()
        }]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [topic, onDrawingInstructions]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [messages]);
  
  const speak = (text: string) => {
    if (isMuted || !text) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesisRef.current = utterance;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.includes('en-US') && voice.name.includes('Female')
    ) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };
  
  const toggleMute = () => {
    if (!isMuted) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const historyContext: GeminiMessage[] = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      
      const promptWithContext = `The student is asking about ${topic}: "${inputValue}"
      Remember you're in the middle of teaching them about ${topic}.
      Respond directly to their question in a helpful, educational way.
      If appropriate, include drawing instructions to visualize concepts.`;
      
      const response = await generateGeminiResponse(promptWithContext, historyContext);
      
      const aiMessage: Message = {
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
        drawingInstructions: response.drawingInstructions
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      
      if (response.drawingInstructions && onDrawingInstructions) {
        onDrawingInstructions(response.drawingInstructions);
        toast.info("Visual explanation created! Check the whiteboard tab to see it.");
      }
      
      speak(response.text);
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast.error("Failed to get AI response. Please try again.");
      
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I couldn't process your request right now. Please try asking again or rephrase your question.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className={cn("glassmorphism h-full flex flex-col", className)}>
      <CardHeader className="px-4 pb-2 pt-3">
        <CardTitle className="text-md flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Tutor Chat
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
              className="h-8 w-8"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-[300px] px-4" ref={scrollAreaRef}>
          <div className="flex flex-col gap-4 py-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-3 text-sm",
                  message.role === 'assistant' ? "items-start" : "items-start justify-end"
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={cn(
                  "rounded-xl px-3 py-2 max-w-[85%]",
                  message.role === 'assistant' 
                    ? "bg-muted" 
                    : "bg-primary text-primary-foreground"
                )}>
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  <div className={cn(
                    "text-xs mt-1",
                    message.role === 'assistant' ? "text-muted-foreground" : "text-primary-foreground/70"
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-3 text-sm animate-fade-in">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-xl px-3 py-2 bg-muted flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <p>Thinking...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-3 border-t border-border/40">
        <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
          <Input 
            placeholder="Ask a question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !inputValue.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AIChat;
