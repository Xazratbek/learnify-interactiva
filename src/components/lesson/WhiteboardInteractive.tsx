
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Pencil, 
  Eraser, 
  Circle, 
  Square, 
  Type, 
  Move, 
  Trash2, 
  Undo, 
  Redo, 
  Download, 
  Save
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { saveWhiteboardData } from '@/services/lessonService';

interface WhiteboardProps {
  initialData?: any;
  onDataUpdate?: (data: any) => void;
  readOnly?: boolean;
  lessonId?: string;
}

const WhiteboardInteractive: React.FC<WhiteboardProps> = ({ 
  initialData, 
  onDataUpdate,
  readOnly = false,
  lessonId = 'default'
}) => {
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
          drawCircle(instruction.x, instruction.y, instruction.radius, instruction.color);
        } else if (instruction.type === 'rect') {
          drawRectangle(instruction.x, instruction.y, instruction.width, instruction.height, instruction.color);
        } else if (instruction.type === 'text') {
          drawText(instruction.x, instruction.y, instruction.text, instruction.color);
        } else if (instruction.type === 'line') {
          drawLine(instruction.x1, instruction.y1, instruction.x2, instruction.y2, instruction.color);
        } else if (instruction.type === 'arrow') {
          drawArrow(instruction.x1, instruction.y1, instruction.x2, instruction.y2, instruction.color);
        }
      });
    }
    
    // Save the new state to history
    saveToHistory();
  }, [initialData]);

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

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    
    const canvas = canvasRef.current;
    if (!canvas || !ctx.current) return;
    
    setIsDrawing(true);
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === 'pencil' || tool === 'eraser') {
      ctx.current.beginPath();
      ctx.current.moveTo(x, y);
    } else if (tool === 'text') {
      setLastX(x);
      setLastY(y);
    } else {
      setLastX(x);
      setLastY(y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly || !isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas || !ctx.current) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === 'pencil') {
      ctx.current.lineTo(x, y);
      ctx.current.stroke();
    } else if (tool === 'eraser') {
      const currentColor = ctx.current.strokeStyle;
      const currentWidth = ctx.current.lineWidth;
      
      ctx.current.strokeStyle = '#ffffff';
      ctx.current.lineWidth = brushSize * 2;
      ctx.current.lineTo(x, y);
      ctx.current.stroke();
      
      // Restore settings
      ctx.current.strokeStyle = currentColor;
      ctx.current.lineWidth = currentWidth;
    }
  };

  const handleMouseUp = () => {
    if (readOnly || !isDrawing) return;
    
    if (tool === 'pencil' || tool === 'eraser') {
      if (ctx.current) {
        ctx.current.closePath();
      }
      saveToHistory();
    } else if (tool === 'circle') {
      const canvas = canvasRef.current;
      if (!canvas || !ctx.current) return;
      
      const rect = canvas.getBoundingClientRect();
      const radius = 30; // Default radius
      
      drawCircle(lastX, lastY, radius, color);
      saveToHistory();
    } else if (tool === 'rectangle') {
      const canvas = canvasRef.current;
      if (!canvas || !ctx.current) return;
      
      const width = 100; // Default width
      const height = 80; // Default height
      
      drawRectangle(lastX, lastY, width, height, color);
      saveToHistory();
    } else if (tool === 'text' && text) {
      drawText(lastX, lastY, text, color);
      saveToHistory();
      setText('');
    }
    
    setIsDrawing(false);
  };

  // Drawing functions
  const drawCircle = (x: number, y: number, radius: number, color: string) => {
    if (!ctx.current) return;
    
    const currentColor = ctx.current.strokeStyle;
    ctx.current.strokeStyle = color;
    
    ctx.current.beginPath();
    ctx.current.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.current.stroke();
    
    // Restore color
    ctx.current.strokeStyle = currentColor;
  };

  const drawRectangle = (x: number, y: number, width: number, height: number, color: string) => {
    if (!ctx.current) return;
    
    const currentColor = ctx.current.strokeStyle;
    ctx.current.strokeStyle = color;
    
    ctx.current.beginPath();
    ctx.current.rect(x - width/2, y - height/2, width, height);
    ctx.current.stroke();
    
    // Restore color
    ctx.current.strokeStyle = currentColor;
  };

  const drawText = (x: number, y: number, text: string, color: string) => {
    if (!ctx.current) return;
    
    const currentColor = ctx.current.fillStyle;
    const fontSize = brushSize * 5;
    
    ctx.current.fillStyle = color;
    ctx.current.font = `${fontSize}px Arial`;
    ctx.current.textAlign = 'center';
    ctx.current.fillText(text, x, y);
    
    // Restore color
    ctx.current.fillStyle = currentColor;
  };

  const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string) => {
    if (!ctx.current) return;
    
    const currentColor = ctx.current.strokeStyle;
    ctx.current.strokeStyle = color;
    
    ctx.current.beginPath();
    ctx.current.moveTo(x1, y1);
    ctx.current.lineTo(x2, y2);
    ctx.current.stroke();
    
    // Restore color
    ctx.current.strokeStyle = currentColor;
  };

  const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string) => {
    if (!ctx.current) return;
    
    const currentColor = ctx.current.strokeStyle;
    ctx.current.strokeStyle = color;
    
    // Draw line
    ctx.current.beginPath();
    ctx.current.moveTo(x1, y1);
    ctx.current.lineTo(x2, y2);
    ctx.current.stroke();
    
    // Calculate arrowhead
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLength = 15;
    
    // Draw the arrowhead
    ctx.current.beginPath();
    ctx.current.moveTo(x2, y2);
    ctx.current.lineTo(
      x2 - headLength * Math.cos(angle - Math.PI/6),
      y2 - headLength * Math.sin(angle - Math.PI/6)
    );
    ctx.current.lineTo(
      x2 - headLength * Math.cos(angle + Math.PI/6),
      y2 - headLength * Math.sin(angle + Math.PI/6)
    );
    ctx.current.closePath();
    ctx.current.fillStyle = color;
    ctx.current.fill();
    
    // Restore colors
    ctx.current.strokeStyle = currentColor;
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

  return (
    <div className="flex flex-col w-full max-w-4xl">
      {!readOnly && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <ToggleGroup type="single" value={tool} onValueChange={(value) => value && setTool(value)}>
            <ToggleGroupItem value="pencil" aria-label="Pencil tool">
              <Pencil className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="eraser" aria-label="Eraser tool">
              <Eraser className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="circle" aria-label="Circle tool">
              <Circle className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="rectangle" aria-label="Rectangle tool">
              <Square className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="text" aria-label="Text tool">
              <Type className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          {tool === 'text' && (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Enter text..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-40"
              />
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="w-8 h-8 p-0">
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: color }} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <div className="flex flex-col gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-[200px] h-8"
                  />
                  <div className="flex flex-wrap gap-1">
                    {['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'].map((c) => (
                      <button
                        key={c}
                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                        style={{ backgroundColor: c }}
                        onClick={() => setColor(c)}
                      />
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <div className="w-5 h-5 flex items-end">
                    <div className="w-full bg-current rounded-full" style={{ height: `${Math.min(brushSize, 5)}px` }} />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <div className="flex flex-col gap-2">
                  <p className="text-sm">Brush size: {brushSize}</p>
                  <Slider
                    value={[brushSize]}
                    min={1}
                    max={20}
                    step={1}
                    onValueChange={(value) => setBrushSize(value[0])}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleUndo} disabled={historyIndex <= 0}>
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
              <Redo className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleClear}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save'}
            </Button>
          </div>
        </div>
      )}
      
      <div className="border rounded-md overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-[500px] touch-none"
          style={{ cursor: readOnly ? 'default' : tool === 'move' ? 'move' : 'crosshair' }}
        />
      </div>
    </div>
  );
};

export default WhiteboardInteractive;
