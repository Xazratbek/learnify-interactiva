
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  topic: string;
  className?: string;
}

const AIChat: React.FC<AIChatProps> = ({ topic, className }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Simulate initial AI message based on the topic
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      setMessages([
        {
          role: 'assistant',
          content: `I'm your AI tutor for ${topic}. How can I help you understand this topic better? Feel free to ask me any questions about ${topic} and I'll do my best to explain it clearly.`,
          timestamp: new Date()
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [topic]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      let response = '';
      
      // Demo responses based on common questions about photosynthesis
      if (inputValue.toLowerCase().includes('what is photosynthesis')) {
        response = 'Photosynthesis is the process by which plants, algae, and some bacteria convert light energy, usually from the sun, into chemical energy in the form of glucose (sugar). This process is essential for life on Earth as it produces oxygen and serves as the basis of most food chains.';
      } else if (inputValue.toLowerCase().includes('how does photosynthesis work')) {
        response = 'Photosynthesis works in two main stages: the light-dependent reactions and the Calvin cycle. In the light-dependent reactions, energy from sunlight is captured to produce ATP and NADPH. These energy-carrying molecules power the Calvin cycle, where carbon dioxide is fixed and converted into glucose.';
      } else if (inputValue.toLowerCase().includes('why is photosynthesis important')) {
        response = 'Photosynthesis is crucial for life on Earth for several reasons: 1) It produces oxygen that most organisms need for respiration. 2) It converts inorganic carbon (CO2) into organic compounds (sugars) that form the basis of food chains. 3) It helps regulate atmospheric CO2 levels. 4) It produces the energy that powers ecosystems.';
      } else if (inputValue.toLowerCase().includes('chlorophyll')) {
        response = 'Chlorophyll is a green pigment found in the chloroplasts of plants, algae, and cyanobacteria. It plays a crucial role in photosynthesis by absorbing light energy, primarily from the blue and red parts of the electromagnetic spectrum. This absorbed energy is then used to power the chemical reactions of photosynthesis.';
      } else {
        response = `That's a great question about ${topic}! The process you're asking about involves several key components and steps. Would you like me to explain the fundamental principles first, or would you prefer I focus on specific aspects that might be confusing you?`;
      }
      
      const aiMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <Card className={cn("glassmorphism h-full flex flex-col", className)}>
      <CardHeader className="px-4 pb-2 pt-3">
        <CardTitle className="text-md flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Tutor Chat
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
