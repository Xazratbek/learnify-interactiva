import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  Pen, 
  Eraser, 
  Square, 
  Circle, 
  Type, 
  Undo2, 
  RotateCcw, 
  Download,
  Check,
  Copy,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface WhiteboardProps {
  className?: string;
}

type Tool = 'pen' | 'eraser' | 'rectangle' | 'circle' | 'text';

const Whiteboard: React.FC<WhiteboardProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#3B82F6');
  const [lineWidth, setLineWidth] = useState(2);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.lineCap = 'round';
      context.lineJoin = 'round';
      setCtx(context);
      
      const initialState = context.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initialState]);
      setHistoryIndex(0);
    }
    
    const handleResize = () => {
      if (!canvas || !context) return;
      
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;
      
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx.drawImage(canvas, 0, 0);
      
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.drawImage(tempCanvas, 0, 0);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const saveState = () => {
    if (!canvasRef.current || !ctx) return;
    
    const canvas = canvasRef.current;
    const newState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    if (historyIndex < history.length - 1) {
      setHistory(history.slice(0, historyIndex + 1));
    }
    
    setHistory([...history, newState]);
    setHistoryIndex(historyIndex + 1);
  };
  
  const startDrawing = (x: number, y: number) => {
    if (!ctx) return;
    
    setIsDrawing(true);
    setStartX(x);
    setStartY(y);
    
    if (tool === 'pen' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
      ctx.lineWidth = tool === 'eraser' ? 20 : lineWidth;
    }
  };
  
  const draw = (x: number, y: number) => {
    if (!ctx || !isDrawing) return;
    
    if (tool === 'pen' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'rectangle') {
      if (historyIndex >= 0) {
        ctx.putImageData(history[historyIndex], 0, 0);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(startX, startY, x - startX, y - startY);
    } else if (tool === 'circle') {
      if (historyIndex >= 0) {
        ctx.putImageData(history[historyIndex], 0, 0);
      }
      const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };
  
  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    saveState();
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    startDrawing(x, y);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    draw(x, y);
  };
  
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    startDrawing(x, y);
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    draw(x, y);
  };
  
  const handleUndo = () => {
    if (historyIndex <= 0) return;
    
    setHistoryIndex(historyIndex - 1);
    
    if (!ctx || !canvasRef.current) return;
    ctx.putImageData(history[historyIndex - 1], 0, 0);
    
    toast("Undo successful", {
      duration: 1500
    });
  };
  
  const handleClear = () => {
    if (!ctx || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const newState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([newState]);
    setHistoryIndex(0);
    
    toast("Whiteboard cleared", {
      duration: 1500
    });
  };
  
  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'ai-tutor-whiteboard.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast("Downloaded whiteboard image", {
      icon: <Check className="h-4 w-4 text-green-500" />
    });
  };
  
  const handleCopy = async () => {
    if (!canvasRef.current) return;
    
    try {
      const canvas = canvasRef.current;
      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob((blob) => resolve(blob!), 'image/png')
      );
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      
      toast("Copied to clipboard", {
        icon: <Check className="h-4 w-4 text-green-500" />
      });
    } catch (error) {
      console.error('Failed to copy', error);
      toast("Failed to copy to clipboard", {
        description: "Your browser may not support this feature",
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />
      });
    }
  };
  
  useEffect(() => {
    if (!ctx || historyIndex < 0 || historyIndex >= history.length) return;
    
    ctx.putImageData(history[historyIndex], 0, 0);
  }, [ctx, historyIndex, history]);
  
  return (
    <div className={cn("whiteboard-container flex flex-col", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-muted/50">
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant={tool === 'pen' ? 'default' : 'outline'} 
            size="icon" 
            onClick={() => setTool('pen')}
            className="h-8 w-8"
          >
            <Pen className="h-4 w-4" />
            <span className="sr-only">Pen</span>
          </Button>
          <Button 
            variant={tool === 'eraser' ? 'default' : 'outline'} 
            size="icon" 
            onClick={() => setTool('eraser')}
            className="h-8 w-8"
          >
            <Eraser className="h-4 w-4" />
            <span className="sr-only">Eraser</span>
          </Button>
          <Button 
            variant={tool === 'rectangle' ? 'default' : 'outline'} 
            size="icon" 
            onClick={() => setTool('rectangle')}
            className="h-8 w-8"
          >
            <Square className="h-4 w-4" />
            <span className="sr-only">Rectangle</span>
          </Button>
          <Button 
            variant={tool === 'circle' ? 'default' : 'outline'} 
            size="icon" 
            onClick={() => setTool('circle')}
            className="h-8 w-8"
          >
            <Circle className="h-4 w-4" />
            <span className="sr-only">Circle</span>
          </Button>
          <Button 
            variant={tool === 'text' ? 'default' : 'outline'} 
            size="icon" 
            onClick={() => setTool('text')}
            className="h-8 w-8"
          >
            <Type className="h-4 w-4" />
            <span className="sr-only">Text</span>
          </Button>
          
          <Separator orientation="vertical" className="h-8 mx-1" />
          
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-8 rounded-md border border-border bg-background p-0"
          />
          
          <div className="flex items-center gap-2 w-24">
            <Slider 
              value={[lineWidth]} 
              min={1} 
              max={10} 
              step={1} 
              onValueChange={(value) => setLineWidth(value[0])}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="h-8 w-8"
          >
            <Undo2 className="h-4 w-4" />
            <span className="sr-only">Undo</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleClear}
            className="h-8 w-8"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleDownload}
            className="h-8 w-8"
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleCopy}
            className="h-8 w-8"
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy</span>
          </Button>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        className={cn("touch-none w-full h-80 border-t border-border", {
          "canvas-draw": tool !== 'eraser'
        })}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
};

export default Whiteboard;
