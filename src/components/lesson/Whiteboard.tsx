
import React, { useEffect } from 'react';
import WhiteboardInteractive from './WhiteboardInteractive';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useWhiteboardData } from '@/hooks/useWhiteboardData';

interface WhiteboardProps {
  className?: string;
  initialData?: any[];
  currentTopic?: string;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ className, initialData, currentTopic }) => {
  const { user } = useAuth();
  // Extract the lesson ID from topic or use a default value
  const lessonId = currentTopic ? currentTopic.replace(/\s+/g, '-').toLowerCase() : 'default';
  
  // Use the updated useWhiteboardData hook with the lessonId
  const { whiteboard, loading, fetchWhiteboardData, saveWhiteboardData } = useWhiteboardData(lessonId);
  
  // Fetch whiteboard data when component mounts
  useEffect(() => {
    if (user && !initialData) {
      fetchWhiteboardData();
    }
  }, [user, lessonId, initialData, fetchWhiteboardData]);
  
  // Process whiteboard data to ensure it's always an array
  const processWhiteboardData = (): any[] => {
    if (initialData) return initialData;
    
    if (!whiteboard || !whiteboard.drawing_data) return [];
    
    // If the data is already an array, use it
    if (Array.isArray(whiteboard.drawing_data)) {
      return whiteboard.drawing_data;
    }
    
    // If it's a string, try to parse it as JSON
    if (typeof whiteboard.drawing_data === 'string') {
      try {
        const parsed = JSON.parse(whiteboard.drawing_data);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error('Error parsing whiteboard data:', e);
        return [];
      }
    }
    
    // Default to empty array if we can't process the data
    return [];
  };
  
  const whiteboardData = processWhiteboardData();
  
  // Handle whiteboard updates
  const handleWhiteboardUpdate = (newData: any) => {
    if (user) {
      // Parse drawing data to store or get image data directly
      const drawingData = typeof newData === 'object' ? 
        (Array.isArray(newData) ? JSON.stringify(newData) : newData.imageData) : 
        newData;
      
      saveWhiteboardData(drawingData);
    }
  };
  
  return (
    <Card className={`${className || ''}`}>
      <CardContent className="p-6 flex justify-center">
        {loading ? (
          <div className="flex items-center justify-center w-full h-[500px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <WhiteboardInteractive 
            initialData={whiteboardData} 
            onDataUpdate={handleWhiteboardUpdate}
            currentTopic={currentTopic}
            lessonId={lessonId}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Whiteboard;
