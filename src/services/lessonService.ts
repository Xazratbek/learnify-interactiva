
// Re-export functions from the refactored files
export { saveLessonProgress } from './lessonProgressService';
export { getLessonContent } from './lessonContentService';
export { generateAIResponse } from './aiChatService';
export { saveWhiteboardData, getWhiteboardData } from './whiteboardService';
export type { AIResponseWithDrawing, DrawingInstruction } from './aiResponseTypes';
