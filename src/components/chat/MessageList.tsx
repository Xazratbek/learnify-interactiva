
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  drawingInstructions?: any[];
}

interface MessageListProps {
  messages: Message[];
  userInitial: string;
  onViewWhiteboard: () => void;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  userInitial, 
  onViewWhiteboard 
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="h-[calc(70vh-13rem)]" ref={scrollAreaRef}>
      <div className="flex flex-col space-y-4">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id}
            message={message}
            userInitial={userInitial}
            onViewWhiteboard={onViewWhiteboard}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
