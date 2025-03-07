
import { useState, useRef } from 'react';

export const useDrawingHistory = () => {
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

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
  };

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

  return {
    canvasRef,
    ctx,
    history,
    historyIndex,
    saveToHistory,
    handleUndo,
    handleRedo,
    handleClear
  };
};
