
import { useState } from 'react';
import { toast } from 'sonner';
import { saveWhiteboardData } from '@/services/lessonService';
import { useAuth } from '@/contexts/AuthContext';

export const useWhiteboardActions = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  lessonId: string = 'default',
  onDataUpdate?: (data: any) => void
) => {
  const { user } = useAuth();
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleSave = async () => {
    if (!user || !canvasRef.current) {
      toast.error("You need to be logged in to save whiteboard data");
      return;
    }
    
    try {
      setSaveStatus('saving');
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/png');
      
      await saveWhiteboardData(user.id, lessonId, imageData);
      
      setSaveStatus('saved');
      toast.success("Whiteboard saved successfully!");
      
      // Reset status after a delay
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error("Error saving whiteboard:", error);
      toast.error("Failed to save whiteboard");
      setSaveStatus('');
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'whiteboard.png';
    link.click();
  };

  const handleAddImage = (url: string) => {
    if (!url) return;
    
    setImageUrl('');
    
    return {
      url,
      canvas: canvasRef.current
    };
  };

  const notifyDataUpdate = () => {
    if (!onDataUpdate || !canvasRef.current) return;
    
    // In a real app, you'd create a structured representation of the drawing
    const dataToSave = {
      timestamp: new Date().toISOString(),
      imageData: canvasRef.current.toDataURL()
    };
    
    onDataUpdate(dataToSave);
  };

  return {
    saveStatus,
    imageUrl,
    setImageUrl,
    handleSave,
    handleDownload,
    handleAddImage,
    notifyDataUpdate
  };
};
