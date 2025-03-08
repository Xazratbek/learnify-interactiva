
import React, { useEffect, useState, useCallback, memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Whiteboard from '@/components/lesson/WhiteboardInteractive';
import { toast } from 'sonner';
import { Download } from 'lucide-react';

interface WhiteboardContainerProps {
  whiteboardData: any;
  onDataUpdate: (data: any) => void;
  onBackToChat: () => void;
  lessonId?: string;
}

// Memoize the component to prevent unnecessary re-renders
const WhiteboardContainer: React.FC<WhiteboardContainerProps> = memo(({
  whiteboardData,
  onDataUpdate,
  onBackToChat,
  lessonId = 'default'
}) => {
  const [isWhiteboardReady, setIsWhiteboardReady] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);
  
  // Use useCallback to prevent recreation of function on each render
  const handleDataUpdate = useCallback((data: any) => {
    try {
      onDataUpdate(data);
      setHasSavedData(data && data.length > 0);
    } catch (error) {
      console.error("Error updating whiteboard data:", error);
      toast.error("Failed to update whiteboard data.");
    }
  }, [onDataUpdate]);

  // Optimize the useEffect to be more efficient
  useEffect(() => {
    let mounted = true;
    
    // Verify whiteboard data format more efficiently
    if (whiteboardData) {
      if (Array.isArray(whiteboardData)) {
        if (mounted) {
          setIsWhiteboardReady(true);
          setHasSavedData(whiteboardData.length > 0);
        }
      } else {
        console.warn("Whiteboard data is not in the expected format:", whiteboardData);
        if (mounted) {
          toast.warning("Whiteboard data format is not valid. Starting with a blank canvas.");
          setIsWhiteboardReady(true);
          setHasSavedData(false);
        }
      }
    } else {
      if (mounted) {
        setIsWhiteboardReady(true);
        setHasSavedData(false);
      }
    }
    
    // Cleanup function to avoid memory leaks and prevent state updates on unmounted component
    return () => {
      mounted = false;
    };
  }, [whiteboardData]);
  
  const handleDownload = useCallback(() => {
    try {
      // Get canvas element
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        toast.error("Could not find canvas element");
        return;
      }
      
      // Create download link
      const link = document.createElement('a');
      link.download = `whiteboard-${lessonId}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success("Whiteboard image downloaded");
    } catch (error) {
      console.error("Error downloading whiteboard:", error);
      toast.error("Failed to download whiteboard image");
    }
  }, [lessonId]);

  return (
    <Card className="min-h-[70vh] flex flex-col">
      <CardHeader className="px-6 py-4 border-b">
        <CardTitle className="text-xl flex items-center gap-2">
          Interactive Whiteboard
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!isWhiteboardReady || !hasSavedData}
              title="Download whiteboard as image"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToChat}
            >
              Back to Chat
            </Button>
          </div>
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
});

// Add display name for debugging
WhiteboardContainer.displayName = 'WhiteboardContainer';

export default WhiteboardContainer;
