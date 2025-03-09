
// This file re-exports everything from the refactored gemini service
// to maintain backward compatibility with existing imports
import { generateGeminiResponse } from './gemini/api';
import { GeminiMessage, GeminiResponse } from './gemini/types';

export {
  generateGeminiResponse,
  GeminiMessage,
  GeminiResponse
};
