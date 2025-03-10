
// Message types for Gemini API
export interface GeminiMessage {
  role: 'user' | 'model';
  parts: {
    text: string;
  }[];
}

// Response type from the Gemini service
export interface GeminiResponse {
  text: string;
  drawingInstructions?: DrawingInstruction[];
  shouldAskFollowUp?: boolean;
  followUpQuestion?: string;
}

// Drawing instruction types
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
