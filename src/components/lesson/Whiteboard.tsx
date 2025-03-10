
import React from 'react';
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
  const { data, loading, updateData } = useWhiteboardData();
  
  // Use initialData if provided, otherwise use saved data
  const whiteboardData = initialData || data;
  
  // Handle whiteboard updates
  const handleWhiteboardUpdate = (newData: any) => {
    if (user) {
      updateData(newData);
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
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Whiteboard;
