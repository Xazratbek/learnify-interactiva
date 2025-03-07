
import { generateGeminiResponse } from './geminiService';

export interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  imageUrl?: string;
}

export const searchTopics = async (query: string): Promise<Topic[]> => {
  try {
    const prompt = `Generate 5 educational topics related to "${query}" in JSON format. Each topic should include id (unique string), title, description (2-3 sentences), category, and difficulty (beginner, intermediate, or advanced). Format the response as a valid JSON array of objects without any additional text or explanations.`;
    
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

export const getSuggestedTopics = async (): Promise<Topic[]> => {
  try {
    const prompt = `Generate 6 diverse educational topics for students in JSON format. Include topics from different fields like science, mathematics, humanities, arts, etc. Each topic should have id (unique string), title, description (2-3 sentences), category, and difficulty (beginner, intermediate, or advanced). Format the response as a valid JSON array of objects without any additional text or explanations.`;
    
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
    return getMockTopics();
  }
};

// Fallback mock topics
const getMockTopics = (): Topic[] => [
  {
    id: 'topic-1',
    title: 'Introduction to Quantum Physics',
    description: 'Learn the fundamental principles of quantum mechanics and how they describe the behavior of matter and energy at the atomic scale.',
    category: 'Physics',
    difficulty: 'intermediate',
  },
  {
    id: 'topic-2',
    title: 'Linear Algebra Fundamentals',
    description: 'Master the essential concepts of vectors, matrices, and linear transformations that form the basis of many advanced mathematical applications.',
    category: 'Mathematics',
    difficulty: 'intermediate',
  },
  {
    id: 'topic-3',
    title: 'Human Anatomy Basics',
    description: 'Explore the structure and organization of the human body systems and how they work together to maintain life.',
    category: 'Biology',
    difficulty: 'beginner',
  },
  {
    id: 'topic-4',
    title: 'World War II: Causes and Consequences',
    description: 'Examine the political, economic, and social factors that led to World War II and its lasting impact on global politics.',
    category: 'History',
    difficulty: 'beginner',
  },
  {
    id: 'topic-5',
    title: 'Introduction to Poetry Analysis',
    description: 'Learn techniques for interpreting and analyzing poetry, including meter, rhyme, imagery, and thematic elements.',
    category: 'Literature',
    difficulty: 'beginner',
  },
  {
    id: 'topic-6',
    title: 'Modern Art Movements',
    description: 'Discover the major art movements of the 20th century and their distinctive styles, philosophies, and influential artists.',
    category: 'Art',
    difficulty: 'beginner',
  },
];
