
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  drawingInstructions?: any[];
  isFollowUpQuestion?: boolean;
}

interface ChatMessageProps {
  message: Message;
  userInitial: string;
  onViewWhiteboard: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  userInitial, 
  onViewWhiteboard 
}) => {
  return (
    <div
      className={cn(
        "flex gap-3 max-w-[80%]",
        message.sender === 'user' ? "ml-auto" : ""
      )}
    >
      {message.sender === 'ai' && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarFallback className={cn(
            "text-primary-foreground",
            message.isFollowUpQuestion ? "bg-amber-500" : "bg-primary"
          )}>
            {message.isFollowUpQuestion ? "?" : "AI"}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={cn(
          "rounded-lg px-4 py-2 text-sm",
          message.sender === 'user'
            ? "bg-primary text-primary-foreground"
            : message.isFollowUpQuestion
              ? "bg-amber-100 border border-amber-300"
              : "bg-muted"
        )}
      >
        {message.isFollowUpQuestion && (
          <div className="flex items-center gap-2 mb-1 text-amber-600 font-medium">
            <HelpCircle className="h-4 w-4" />
            <span>Follow-up Question</span>
          </div>
        )}
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.drawingInstructions && (
          <Button 
            variant="link" 
            size="sm" 
            className="p-0 h-auto mt-1 text-xs"
            onClick={onViewWhiteboard}
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
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
