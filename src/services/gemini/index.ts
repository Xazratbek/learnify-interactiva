
// Export all Gemini service components from a single entry point
export { generateGeminiResponse } from './api';
export { saveConversation, getConversationHistory } from './storage';
export type { GeminiMessage, GeminiResponse } from './types';
