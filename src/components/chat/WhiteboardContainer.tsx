
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Whiteboard from '@/components/lesson/WhiteboardInteractive';

interface WhiteboardContainerProps {
  whiteboardData: any;
  onDataUpdate: (data: any) => void;
  onBackToChat: () => void;
  lessonId?: string;
}

const WhiteboardContainer: React.FC<WhiteboardContainerProps> = ({
  whiteboardData,
  onDataUpdate,
  onBackToChat,
  lessonId = 'default'
}) => {
  return (
    <Card className="min-h-[70vh] flex flex-col">
      <CardHeader className="px-6 py-4 border-b">
        <CardTitle className="text-xl flex items-center gap-2">
          Interactive Whiteboard
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={onBackToChat}
          >
            Back to Chat
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-6 overflow-hidden flex justify-center items-center">
        <Whiteboard 
          initialData={whiteboardData}
          onDataUpdate={onDataUpdate}
          readOnly={false}
          lessonId={lessonId}
        />
      </CardContent>
    </Card>
  );
};

export default WhiteboardContainer;
