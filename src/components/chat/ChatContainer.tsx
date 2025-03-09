
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, PenLine, Plus, History } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

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

interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onViewWhiteboard: () => void;
  isSpeaking: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  isAiThinking?: boolean;
  chatHistory?: Chat[];
  onNewChat?: () => void;
  onSelectChat?: (chatId: string) => void;
  currentChatTitle?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  onSendMessage,
  onViewWhiteboard,
  isSpeaking,
  isMuted,
  onToggleMute,
  isAiThinking = false,
  chatHistory = [],
  onNewChat,
  onSelectChat,
  currentChatTitle = "New Chat"
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
            {(isSpeaking || isAiThinking) && (
              <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${isAiThinking ? 'bg-amber-500 animate-pulse' : 'bg-green-500'} border-2 border-background`}></span>
            )}
          </div>
          <span className="truncate">{currentChatTitle}</span>
          {isAiThinking && <span className="text-sm text-muted-foreground ml-2">(thinking...)</span>}
          <div className="ml-auto flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleMute}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isMuted ? "Unmute" : "Mute"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onViewWhiteboard}
                  >
                    <PenLine className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Open Whiteboard
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Drawer>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DrawerTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                      >
                        <History className="h-5 w-5" />
                      </Button>
                    </DrawerTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    Chat History
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DrawerContent>
                <div className="p-4 max-w-xl mx-auto">
                  <h3 className="text-lg font-semibold mb-2">Chat History</h3>
                  <Button 
                    variant="outline" 
                    className="w-full mb-4 flex items-center gap-2"
                    onClick={onNewChat}
                  >
                    <Plus className="h-4 w-4" />
                    New Chat
                  </Button>
                  <Separator className="mb-4" />
                  <ScrollArea className="h-[50vh]">
                    {chatHistory.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {chatHistory.map((chat) => (
                          <Button 
                            key={chat.id} 
                            variant="ghost" 
                            className="justify-start text-left h-auto py-3"
                            onClick={() => onSelectChat && onSelectChat(chat.id)}
                          >
                            <div className="truncate">
                              <div className="font-medium truncate">{chat.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {chat.timestamp.toLocaleDateString()} • {chat.messages.length} messages
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        No previous chats found
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </DrawerContent>
            </Drawer>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onNewChat}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  New Chat
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
        <ChatInput 
          onSendMessage={onSendMessage} 
          disabled={isAiThinking} 
        />
      </CardFooter>
    </Card>
  );
};

export default ChatContainer;
