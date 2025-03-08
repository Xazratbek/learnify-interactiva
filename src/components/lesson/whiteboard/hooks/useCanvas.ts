
import { useState, useEffect, RefObject, MutableRefObject } from 'react';

export const useCanvas = (
  canvasRef: RefObject<HTMLCanvasElement>,
  ctx: MutableRefObject<CanvasRenderingContext2D | null>,
  color: string,
  brushSize: number,
  saveToHistory: () => void
) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lastX, setLastX] = useState<number>(0);
  const [lastY, setLastY] = useState<number>(0);
  
  // Set up the canvas when the component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    ctx.current = context;
    ctx.current.lineCap = 'round';
    ctx.current.lineJoin = 'round';
    ctx.current.strokeStyle = color;
    ctx.current.lineWidth = brushSize;
  }, [canvasRef, ctx, color, brushSize]);
  
  // Update color and brush size when they change
  useEffect(() => {
    if (!ctx.current) return;
    ctx.current.strokeStyle = color;
    ctx.current.lineWidth = brushSize;
  }, [color, brushSize, ctx]);
  
  const drawImageFromUrl = (
    url: string, 
    x: number, 
    y: number,
    width: number,
    height: number
  ) => {
    if (!ctx.current || !canvasRef.current) return;
    
    const img = new Image();
    img.onload = () => {
      ctx.current?.drawImage(img, x, y, width, height);
      saveToHistory();
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
