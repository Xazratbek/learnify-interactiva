
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { generateGeminiResponse } from '@/services/gemini';
import { DrawingInstruction } from '@/services/gemini/types';

export const useAIDrawing = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>,
  handleClear: () => void,
  saveToHistory: () => void,
  brushSize: number
) => {
  const { user } = useAuth();
  
  const drawFromInstructions = (instructions: DrawingInstruction[]) => {
    if (!instructions || !Array.isArray(instructions) || !ctx.current) return;
    
    const { drawCircle, drawRectangle, drawText, drawLine, drawArrow } = require('../drawingUtils');
    
    instructions.forEach(instruction => {
      if (instruction.type === 'circle') {
        drawCircle(ctx.current, instruction.x, instruction.y, instruction.radius, instruction.color || '#000000');
      } else if (instruction.type === 'rect' || instruction.type === 'rectangle') {
        drawRectangle(ctx.current, instruction.x, instruction.y, instruction.width, instruction.height, instruction.color || '#000000');
      } else if (instruction.type === 'text') {
        drawText(ctx.current, instruction.x, instruction.y, instruction.text || '', instruction.color || '#000000', brushSize);
      } else if (instruction.type === 'line') {
        drawLine(ctx.current, instruction.x1 || 0, instruction.y1 || 0, instruction.x2 || 0, instruction.y2 || 0, instruction.color || '#000000');
      } else if (instruction.type === 'arrow') {
        drawArrow(ctx.current, instruction.x1 || 0, instruction.y1 || 0, instruction.x2 || 0, instruction.y2 || 0, instruction.color || '#000000');
      }
    });
  };

  const generateAIDrawing = async (prompt: string, topicContext?: string) => {
    if (!user) {
      toast.error("You need to be logged in to use AI drawing");
      return;
    }
    
    try {
      toast.info("Generating drawing based on your prompt...");
      
      // Create a prompt for Gemini that asks for drawing instructions
      let aiPrompt = `Create drawing instructions for a whiteboard visualization of: "${prompt}".\n`;
      
      // Add topic context if provided
      if (topicContext) {
        aiPrompt += `The current topic being discussed is: "${topicContext}".\n`;
      }
      
      aiPrompt += `Return a JSON array of drawing instructions without any text explanations around it.
      Each instruction should be an object with: 
      - "type" (circle, rect, line, arrow, text)
      - coordinates (x, y for objects, x1, y1, x2, y2 for lines and arrows)
      - other properties like radius for circles, width/height for rectangles, text content for text elements
      - "color" property for each element

      Make the drawing well-organized, educational, and visually clear.
      Use the canvas dimensions of approximately 800x500 pixels.
      Be sure to include labels and annotations where appropriate.
      
      Example format:
      [
        {"type": "circle", "x": 200, "y": 200, "radius": 50, "color": "#FF5733"},
        {"type": "text", "x": 200, "y": 200, "text": "Earth", "color": "#000000"},
        {"type": "arrow", "x1": 100, "y1": 300, "x2": 300, "y2": 100, "color": "#3366FF"}
      ]`;
      
      const response = await generateGeminiResponse(aiPrompt);
      const instructions = response.drawingInstructions;
      
      // Clear the canvas first
      handleClear();
      
      // Apply each drawing instruction
      if (Array.isArray(instructions) && instructions.length > 0) {
        drawFromInstructions(instructions);
        saveToHistory();
        toast.success("Drawing generated successfully!");
        return instructions;
      } else {
        const jsonMatch = response.text.match(/\[\s*\{.+\}\s*\]/s);
        if (jsonMatch) {
          try {
            const parsedInstructions = JSON.parse(jsonMatch[0]);
            if (Array.isArray(parsedInstructions) && parsedInstructions.length > 0) {
              drawFromInstructions(parsedInstructions);
              saveToHistory();
              toast.success("Drawing generated successfully!");
              return parsedInstructions;
            }
          } catch (e) {
            console.error('Failed to parse instructions from text:', e);
            throw new Error('No valid drawing instructions found');
          }
        } else {
          throw new Error('No valid drawing instructions found');
        }
      }
    } catch (error) {
      console.error('Error generating AI drawing:', error);
      toast.error("Failed to generate drawing. Please try again.");
      return null;
    }
  };

  return {
    generateAIDrawing,
    drawFromInstructions
  };
};
