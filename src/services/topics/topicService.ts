
import { generateGeminiResponse } from '../gemini';
import { Topic, TopicsByDifficulty } from './types';
import { getAllTopics, getTopicsByDifficulty, getTopicsGroupedByDifficulty } from './allTopics';

// Search for topics using the Gemini AI model
export const searchTopics = async (query: string): Promise<Topic[]> => {
  try {
    const prompt = `Generate 10 educational topics related to "${query}" in JSON format. Each topic should include id (unique string), title, description (2-3 sentences), category, and difficulty (beginner, intermediate, or advanced). Format the response as a valid JSON array of objects without any additional text or explanations.`;
    
    const response = await generateGeminiResponse(prompt);
    
    // Parse the JSON response
    const topicsText = response.text.trim();
    // Extract JSON if it's wrapped in markdown code blocks
    const jsonMatch = topicsText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, topicsText];
    const jsonString = jsonMatch[1].trim();
    
    let topics = JSON.parse(jsonString);
    
    // Ensure each topic has all required fields
    return topics.map((topic: any, index: number) => ({
      id: topic.id || `topic-${Date.now()}-${index}`,
      title: topic.title || 'Untitled Topic',
      description: topic.description || 'No description available',
      category: topic.category || 'General',
      difficulty: ['beginner', 'intermediate', 'advanced'].includes(topic.difficulty) 
        ? topic.difficulty 
        : 'beginner',
    }));
  } catch (error) {
    console.error('Error searching topics:', error);
    return [];
  }
};

// Get suggested topics using the Gemini AI model
export const getSuggestedTopics = async (): Promise<Topic[]> => {
  try {
    const prompt = `Generate 15 diverse educational topics for students in JSON format. Include 5 beginner, 5 intermediate, and 5 advanced topics from different fields like science, mathematics, humanities, arts, etc. Each topic should have id (unique string), title, description (2-3 sentences), category, and difficulty (beginner, intermediate, or advanced). Format the response as a valid JSON array of objects without any additional text or explanations.`;
    
    const response = await generateGeminiResponse(prompt);
    
    // Parse the JSON response
    const topicsText = response.text.trim();
    // Extract JSON if it's wrapped in markdown code blocks
    const jsonMatch = topicsText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, topicsText];
    const jsonString = jsonMatch[1].trim();
    
    let topics = JSON.parse(jsonString);
    
    // Ensure each topic has all required fields
    return topics.map((topic: any, index: number) => ({
      id: topic.id || `topic-${Date.now()}-${index}`,
      title: topic.title || 'Untitled Topic',
      description: topic.description || 'No description available',
      category: topic.category || 'General',
      difficulty: ['beginner', 'intermediate', 'advanced'].includes(topic.difficulty) 
        ? topic.difficulty 
        : 'beginner',
    }));
  } catch (error) {
    console.error('Error getting suggested topics:', error);
    return getAllTopics();
  }
};

// Export functions from allTopics.ts for backward compatibility
export { getAllTopics as getExpandedTopics, getTopicsByDifficulty, getTopicsGroupedByDifficulty };
