
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { saveWhiteboardData } from '@/services/lessonService';
import { useAuth } from '@/contexts/AuthContext';
import { drawCircle, drawRectangle, drawText, drawLine, drawArrow } from './drawingUtils';

export const useWhiteboardState = (initialData?: any, onDataUpdate?: (data: any) => void, readOnly = false, lessonId = 'default') => {
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<string>('pencil');
  const [color, setColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [text, setText] = useState<string>('');
  const [lastX, setLastX] = useState<number>(0);
  const [lastY, setLastY] = useState<number>(0);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Get context
    const context = canvas.getContext('2d');
    if (!context) return;
    
    ctx.current = context;
    ctx.current.lineCap = 'round';
    ctx.current.lineJoin = 'round';
    ctx.current.strokeStyle = color;
    ctx.current.lineWidth = brushSize;
    
    // Save initial canvas state
    const initialState = context.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialState]);
    setHistoryIndex(0);

    // Handle window resize
    const handleResize = () => {
      if (!canvas || !context) return;
      
      // Save current image
      const currentImage = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Resize canvas
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Restore image
      context.putImageData(currentImage, 0, 0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update brush settings when changed
  useEffect(() => {
    if (!ctx.current) return;
    ctx.current.strokeStyle = color;
    ctx.current.lineWidth = brushSize;
  }, [color, brushSize]);

  // Process initial data if provided
  useEffect(() => {
    if (!initialData || !ctx.current || !canvasRef.current) return;
    
    // Clear canvas first
    ctx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Process drawing instructions
    if (Array.isArray(initialData)) {
      initialData.forEach(instruction => {
        if (instruction.type === 'clear') {
          ctx.current?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        } else if (instruction.type === 'circle') {
          drawCircle(ctx.current!, instruction.x, instruction.y, instruction.radius, instruction.color);
        } else if (instruction.type === 'rect') {
          drawRectangle(ctx.current!, instruction.x, instruction.y, instruction.width, instruction.height, instruction.color);
        } else if (instruction.type === 'text') {
          drawText(ctx.current!, instruction.x, instruction.y, instruction.text, instruction.color, brushSize);
        } else if (instruction.type === 'line') {
          drawLine(ctx.current!, instruction.x1, instruction.y1, instruction.x2, instruction.y2, instruction.color);
        } else if (instruction.type === 'arrow') {
          drawArrow(ctx.current!, instruction.x1, instruction.y1, instruction.x2, instruction.y2, instruction.color);
        }
      });
    }
    
    // Save the new state to history
    saveToHistory();
  }, [initialData, brushSize]);

  // Save current state to history
  const saveToHistory = () => {
    if (!canvasRef.current || !ctx.current) return;
    
    const canvas = canvasRef.current;
    const currentState = ctx.current.getImageData(0, 0, canvas.width, canvas.height);
    
    // If we're in the middle of history, truncate
    if (historyIndex < history.length - 1) {
      setHistory(history.slice(0, historyIndex + 1));
    }
    
    setHistory(prev => [...prev, currentState]);
    setHistoryIndex(prev => prev + 1);
    
    // Notify parent component about data update
    if (onDataUpdate) {
      // In a real app, you'd create a structured representation of the drawing
      const dataToSave = {
        timestamp: new Date().toISOString(),
        imageData: canvas.toDataURL()
      };
      onDataUpdate(dataToSave);
    }
  };

  // Action handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      
      const canvas = canvasRef.current;
      if (!canvas || !ctx.current) return;
      
      ctx.current.putImageData(history[historyIndex - 1], 0, 0);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      
      const canvas = canvasRef.current;
      if (!canvas || !ctx.current) return;
      
      ctx.current.putImageData(history[historyIndex + 1], 0, 0);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ctx.current) return;
    
    ctx.current.clearRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

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

  return {
    canvasRef,
    ctx,
    tool,
    setTool,
    color,
    setColor,
    brushSize,
    setBrushSize,
    isDrawing,
    setIsDrawing,
    history,
    historyIndex,
    text,
    setText,
    lastX,
    setLastX,
    lastY,
    setLastY,
    saveStatus,
    readOnly,
    handleUndo,
    handleRedo,
    handleClear,
    handleSave,
    handleDownload,
    saveToHistory,
    drawCircle,
    drawRectangle,
    drawText,
  };
};
