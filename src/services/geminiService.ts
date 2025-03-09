
// This file re-exports everything from the refactored gemini service
// to maintain backward compatibility with existing imports
import { generateGeminiResponse } from './gemini/api';
import type { GeminiMessage, GeminiResponse } from './gemini/types';

// Re-export the function
export { generateGeminiResponse };

// Re-export the types with the correct syntax
export type { GeminiMessage, GeminiResponse };
