
import { useEffect } from 'react';

export const useCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>,
  color: string,
  brushSize: number,
  saveToHistory: () => void
) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lastX, setLastX] = useState<number>(0);
  const [lastY, setLastY] = useState<number>(0);
  
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

  // Draw image from URL
  const drawImageFromUrl = (url: string, x: number, y: number, width: number, height: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !ctx.current) return;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.current?.drawImage(img, x, y, width || img.width, height || img.height);
      saveToHistory();
    };
    img.onerror = () => {
      console.error('Error loading image:', url);
    };
    img.src = url;
  };

  return {
    isDrawing,
    setIsDrawing,
    lastX,
    setLastX,
    lastY,
    setLastY,
    drawImageFromUrl
  };
};
