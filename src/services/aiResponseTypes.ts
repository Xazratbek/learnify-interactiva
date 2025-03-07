
// Define the AI response types
export interface DrawingInstruction {
  type: string;
  x?: number;
  y?: number;
  radius?: number;
  color?: string;
  text?: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  width?: number;
  height?: number;
}

export interface AIResponseWithDrawing {
  text: string;
  drawingInstructions: DrawingInstruction[];
}
