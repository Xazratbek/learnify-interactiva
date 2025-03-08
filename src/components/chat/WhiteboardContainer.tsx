
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Whiteboard from '@/components/lesson/WhiteboardInteractive';
import { toast } from 'sonner';

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
  const [isWhiteboardReady, setIsWhiteboardReady] = useState(false);
  
  useEffect(() => {
    // Verify whiteboard data format
    if (whiteboardData) {
      try {
        if (Array.isArray(whiteboardData)) {
          setIsWhiteboardReady(true);
        } else {
          console.warn("Whiteboard data is not in the expected format:", whiteboardData);
          toast.warning("Whiteboard data format is not valid. Starting with a blank canvas.");
          setIsWhiteboardReady(true);
        }
      } catch (error) {
        console.error("Error processing whiteboard data:", error);
        toast.error("There was an issue loading the whiteboard data.");
        setIsWhiteboardReady(true);
      }
    } else {
      // No data, but whiteboard should still work with a blank canvas
      setIsWhiteboardReady(true);
    }
  }, [whiteboardData]);
  
  const handleDataUpdate = (data: any) => {
    try {
      onDataUpdate(data);
    } catch (error) {
      console.error("Error updating whiteboard data:", error);
      toast.error("Failed to update whiteboard data.");
    }
  };

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
        {isWhiteboardReady ? (
          <Whiteboard 
            initialData={whiteboardData}
            onDataUpdate={handleDataUpdate}
            readOnly={false}
            lessonId={lessonId}
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading whiteboard...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhiteboardContainer;
