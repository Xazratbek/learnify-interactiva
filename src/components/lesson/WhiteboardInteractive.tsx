
import React from 'react';
import WhiteboardToolbar from './whiteboard/WhiteboardToolbar';
import ColorPicker from './whiteboard/ColorPicker';
import WhiteboardCanvas from './whiteboard/WhiteboardCanvas';
import { useWhiteboardState } from './whiteboard/useWhiteboardState';
import { drawCircle, drawRectangle, drawText } from './whiteboard/drawingUtils';

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
  const {
    canvasRef,
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
    imageUrl,
    setImageUrl,
    handleUndo,
    handleRedo,
    handleClear,
    handleSave,
    handleDownload,
    handleAddImage,
    saveToHistory,
    generateAIDrawing,
  } = useWhiteboardState(initialData, onDataUpdate, readOnly, lessonId);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    
    const canvas = canvasRef.current;
    if (!canvas || !canvasRef.current?.getContext('2d')) return;
    
    setIsDrawing(true);
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === 'pencil' || tool === 'eraser') {
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
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
    if (!canvas || !canvasRef.current?.getContext('2d')) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === 'pencil') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      const currentColor = ctx.strokeStyle;
      const currentWidth = ctx.lineWidth;
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = brushSize * 2;
      ctx.lineTo(x, y);
      ctx.stroke();
      
      // Restore settings
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentWidth;
    }
  };

  const handleMouseUp = () => {
    if (readOnly || !isDrawing) return;
    
    if (tool === 'pencil' || tool === 'eraser') {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.closePath();
      }
      saveToHistory();
    } else if (tool === 'circle') {
      const canvas = canvasRef.current;
      if (!canvas || !canvasRef.current?.getContext('2d')) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      const radius = 30; // Default radius
      
      drawCircle(ctx, lastX, lastY, radius, color);
      saveToHistory();
    } else if (tool === 'rectangle') {
      const canvas = canvasRef.current;
      if (!canvas || !canvasRef.current?.getContext('2d')) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      const width = 100; // Default width
      const height = 80; // Default height
      
      drawRectangle(ctx, lastX, lastY, width, height, color);
      saveToHistory();
    } else if (tool === 'text' && text) {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        drawText(ctx, lastX, lastY, text, color, brushSize);
        saveToHistory();
        setText('');
      }
    }
    
    setIsDrawing(false);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl">
      {!readOnly && (
        <>
          <WhiteboardToolbar
            tool={tool}
            setTool={setTool}
            text={text}
            setText={setText}
            handleUndo={handleUndo}
            handleRedo={handleRedo}
            handleClear={handleClear}
            handleDownload={handleDownload}
            handleSave={handleSave}
            saveStatus={saveStatus}
            historyIndex={historyIndex}
            history={history}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            handleAddImage={handleAddImage}
            generateAIDrawing={generateAIDrawing}
          />
          
          <ColorPicker
            color={color}
            brushSize={brushSize}
            setColor={setColor}
            setBrushSize={setBrushSize}
          />
        </>
      )}
      
      <WhiteboardCanvas
        canvasRef={canvasRef}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        tool={tool}
        readOnly={readOnly}
      />
    </div>
  );
};

export default WhiteboardInteractive;
