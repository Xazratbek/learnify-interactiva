
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { generateGeminiResponse } from '@/services/geminiService';

export const useAIDrawing = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>,
  handleClear: () => void,
  saveToHistory: () => void,
  brushSize: number
) => {
  const { user } = useAuth();
  
  const drawFromInstructions = (instructions: any[]) => {
    if (!instructions || !Array.isArray(instructions) || !ctx.current) return;
    
    const { drawCircle, drawRectangle, drawText, drawLine, drawArrow } = require('../drawingUtils');
    
    instructions.forEach(instruction => {
      if (instruction.type === 'circle') {
        drawCircle(ctx.current, instruction.x, instruction.y, instruction.radius, instruction.color);
      } else if (instruction.type === 'rect') {
        drawRectangle(ctx.current, instruction.x, instruction.y, instruction.width, instruction.height, instruction.color);
      } else if (instruction.type === 'text') {
        drawText(ctx.current, instruction.x, instruction.y, instruction.text, instruction.color, brushSize);
      } else if (instruction.type === 'line') {
        drawLine(ctx.current, instruction.x1, instruction.y1, instruction.x2, instruction.y2, instruction.color);
      } else if (instruction.type === 'arrow') {
        drawArrow(ctx.current, instruction.x1, instruction.y1, instruction.x2, instruction.y2, instruction.color);
      }
    });
  };

  const generateAIDrawing = async (prompt: string) => {
    if (!user) {
      toast.error("You need to be logged in to use AI drawing");
      return;
    }
    
    try {
      toast.info("Generating drawing based on your prompt...");
      
      // Create a prompt for Gemini that asks for drawing instructions
      const aiPrompt = `Create drawing instructions for a whiteboard visualization of: "${prompt}". 
      Return ONLY a JSON array of drawing instructions without any other explanation. 
      Each instruction should be an object with: type (circle, rect, line, arrow, text), 
      coordinates (x, y for objects, x1, y1, x2, y2 for lines and arrows), 
      and other properties like radius for circles, width/height for rectangles, text content for text.
      Make sure the drawing uses the canvas dimensions of approximately 800x500 pixels.
      Example format:
      [
        {"type": "circle", "x": 200, "y": 200, "radius": 50, "color": "#FF5733"},
        {"type": "text", "x": 200, "y": 200, "text": "Earth", "color": "#000000"},
        {"type": "arrow", "x1": 100, "y1": 300, "x2": 300, "y2": 100, "color": "#3366FF"}
      ]`;
      
      const { text } = await generateGeminiResponse(aiPrompt);
      
      // Extract the JSON array from the response
      const jsonMatch = text.match(/\[\s*{.*}\s*\]/s);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in the response');
      }
      
      const instructions = JSON.parse(jsonMatch[0]);
      
      // Clear the canvas first
      handleClear();
      
      // Apply each drawing instruction
      if (Array.isArray(instructions) && instructions.length > 0) {
        drawFromInstructions(instructions);
        saveToHistory();
        toast.success("Drawing generated successfully!");
      } else {
        throw new Error('No valid drawing instructions found');
      }
    } catch (error) {
      console.error('Error generating AI drawing:', error);
      toast.error("Failed to generate drawing. Please try again.");
    }
  };

  return {
    generateAIDrawing,
    drawFromInstructions
  };
};
