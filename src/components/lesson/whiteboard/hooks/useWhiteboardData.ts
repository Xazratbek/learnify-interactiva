
import { useEffect } from 'react';

export const useWhiteboardData = (
  initialData: any,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>,
  saveToHistory: () => void,
  drawImageFromUrl: (url: string, x: number, y: number, width: number, height: number) => void,
  brushSize: number
) => {
  const { drawCircle, drawRectangle, drawText, drawLine, drawArrow } = require('../drawingUtils');

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
        } else if (instruction.type === 'image' && instruction.url) {
          drawImageFromUrl(instruction.url, instruction.x, instruction.y, instruction.width, instruction.height);
        }
      });
    }
    
    // Save the new state to history
    saveToHistory();
  }, [initialData, brushSize]);
};
