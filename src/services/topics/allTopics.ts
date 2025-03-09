
import { Topic, TopicsByDifficulty } from './types';
import { programmingTopics } from './programmingTopics';
import { physicsTopics } from './physicsTopics';
import { mathTopics } from './mathTopics';
import { historyTopics } from './historyTopics';
import { biologyTopics } from './biologyTopics';
import { chemistryTopics } from './chemistryTopics';
import { literatureAndArtTopics } from './literatureAndArtTopics';

// Combine all topics into a single array
export const getAllTopics = (): Topic[] => {
  return [
    ...programmingTopics,
    ...physicsTopics,
    ...mathTopics,
    ...historyTopics,
    ...biologyTopics,
    ...chemistryTopics,
    ...literatureAndArtTopics,
  ];
};

// Get topics filtered by difficulty
export const getTopicsByDifficulty = (difficulty: string): Topic[] => {
  const allTopics = getAllTopics();
  
  if (difficulty === 'all') {
    return allTopics;
  }
  
  return allTopics.filter(topic => topic.difficulty === difficulty);
};

// Get topics grouped by difficulty
export const getTopicsGroupedByDifficulty = (): TopicsByDifficulty => {
  const allTopics = getAllTopics();
  
  return {
    beginner: allTopics.filter(topic => topic.difficulty === 'beginner'),
    intermediate: allTopics.filter(topic => topic.difficulty === 'intermediate'),
    advanced: allTopics.filter(topic => topic.difficulty === 'advanced')
  };
};
