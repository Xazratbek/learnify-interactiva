
import { useState } from 'react';

export const useDrawingTools = () => {
  const [tool, setTool] = useState<string>('pencil');
  const [color, setColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(3);
  const [text, setText] = useState<string>('');

  return {
    tool,
    setTool,
    color, 
    setColor,
    brushSize,
    setBrushSize,
    text,
    setText
  };
};
