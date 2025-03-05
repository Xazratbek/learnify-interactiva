
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, PenLine } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  drawingInstructions?: any[];
}

interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onViewWhiteboard: () => void;
  isSpeaking: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  onSendMessage,
  onViewWhiteboard,
  isSpeaking,
  isMuted,
  onToggleMute
}) => {
  const { user } = useAuth();
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  return (
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
              onClick={onToggleMute}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onViewWhiteboard}
              title="Open Whiteboard"
            >
              <PenLine className="h-5 w-5" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-6 overflow-hidden">
        <MessageList 
          messages={messages} 
          userInitial={userInitial}
          onViewWhiteboard={onViewWhiteboard}
        />
      </CardContent>
      
      <CardFooter className="p-4 border-t">
        <ChatInput onSendMessage={onSendMessage} />
      </CardFooter>
    </Card>
  );
};

export default ChatContainer;
