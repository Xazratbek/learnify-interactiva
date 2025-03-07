
import { useState } from 'react';
import { useDrawingTools } from './hooks/useDrawingTools';
import { useDrawingHistory } from './hooks/useDrawingHistory';
import { useCanvas } from './hooks/useCanvas';
import { useWhiteboardActions } from './hooks/useWhiteboardActions';
import { useAIDrawing } from './hooks/useAIDrawing';
import { useWhiteboardData } from './hooks/useWhiteboardData';

export const useWhiteboardState = (initialData?: any, onDataUpdate?: (data: any) => void, readOnly = false, lessonId = 'default') => {
  // Combine our smaller hooks
  const { tool, setTool, color, setColor, brushSize, setBrushSize, text, setText } = useDrawingTools();
  const { canvasRef, ctx, history, historyIndex, saveToHistory, handleUndo, handleRedo, handleClear } = useDrawingHistory();
  
  // Get canvas operations
  const { isDrawing, setIsDrawing, lastX, setLastX, lastY, setLastY, drawImageFromUrl } = useCanvas(
    canvasRef, 
    ctx, 
    color, 
    brushSize, 
    saveToHistory
  );
  
  // Get whiteboard actions
  const { 
    saveStatus, 
    imageUrl, 
    setImageUrl, 
    handleSave, 
    handleDownload, 
    handleAddImage: handleAddImageBase, 
    notifyDataUpdate 
  } = useWhiteboardActions(canvasRef, lessonId, onDataUpdate);
  
  // Handle adding images
  const handleAddImage = (url: string) => {
    const result = handleAddImageBase(url);
    if (!result) return;
    
    // Calculate center of canvas
    const canvas = result.canvas;
    if (!canvas || !ctx.current) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Default image size
    const defaultWidth = 200;
    const defaultHeight = 150;
    
    drawImageFromUrl(url, centerX - defaultWidth/2, centerY - defaultHeight/2, defaultWidth, defaultHeight);
  };
  
  // Get AI drawing features
  const { generateAIDrawing } = useAIDrawing(canvasRef, ctx, handleClear, saveToHistory, brushSize);
  
  // Load initial data if available
  useWhiteboardData(initialData, canvasRef, ctx, saveToHistory, drawImageFromUrl, brushSize);
  
  // Override saveToHistory to notify parent component
  const enhancedSaveToHistory = () => {
    saveToHistory();
    notifyDataUpdate();
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
    imageUrl,
    setImageUrl,
    handleUndo,
    handleRedo,
    handleClear,
    handleSave,
    handleDownload,
    handleAddImage,
    saveToHistory: enhancedSaveToHistory,
    generateAIDrawing,
    drawCircle: (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) => {
      const { drawCircle } = require('./drawingUtils');
      return drawCircle(ctx, x, y, radius, color);
    },
    drawRectangle: (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) => {
      const { drawRectangle } = require('./drawingUtils');
      return drawRectangle(ctx, x, y, width, height, color);
    },
    drawText: (ctx: CanvasRenderingContext2D, x: number, y: number, text: string, color: string) => {
      const { drawText } = require('./drawingUtils');
      return drawText(ctx, x, y, text, color, brushSize);
    }
  };
};
