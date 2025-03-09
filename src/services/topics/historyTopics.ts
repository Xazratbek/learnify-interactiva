
import { Topic } from './types';

export const beginnerHistoryTopics: Topic[] = [
  {
    id: 'hist-1',
    title: 'Ancient Civilizations',
    description: 'Explore the rise and fall of early human societies including Mesopotamia, Egypt, Greece, and Rome. Learn how these cultures shaped our modern world.',
    category: 'History',
    difficulty: 'beginner',
  },
  {
    id: 'hist-5',
    title: 'History of Colonial America',
    description: 'Explore the European colonization of North America and the formation of the United States. Learn about colonial life, the American Revolution, and early republic.',
    category: 'History',
    difficulty: 'beginner',
  },
  {
    id: 'hist-9',
    title: 'The Civil Rights Movement',
    description: 'Study the struggle for racial equality in the United States from the 1950s to 1960s. Learn about key leaders, protests, legislation, and ongoing challenges.',
    category: 'History',
    difficulty: 'beginner',
  }
];

export const intermediateHistoryTopics: Topic[] = [
  {
    id: 'hist-2',
    title: 'World War II',
    description: 'Examine the causes, major events, and consequences of the largest global conflict in history. Learn about key figures, battles, and the Holocaust.',
    category: 'History',
    difficulty: 'intermediate',
  },
  {
    id: 'hist-3',
    title: 'The Renaissance and Reformation',
    description: 'Study the intellectual, artistic, and religious transformations in Europe from the 14th to 17th centuries. Learn how these movements shaped modern thought.',
    category: 'History',
    difficulty: 'intermediate',
  },
  {
    id: 'hist-4',
    title: 'The Cold War Era',
    description: 'Analyze the geopolitical tensions between the United States and Soviet Union from 1947 to 1991. Learn about proxy wars, nuclear proliferation, and ideological conflict.',
    category: 'History',
    difficulty: 'intermediate',
  },
  {
    id: 'hist-6',
    title: 'The Industrial Revolution',
    description: 'Study the technological, economic, and social transformations that began in Britain in the late 18th century. Learn how industrialization changed human society.',
    category: 'History',
    difficulty: 'intermediate',
  },
  {
    id: 'hist-7',
    title: 'Ancient Chinese Dynasties',
    description: 'Discover the rich history of imperial China from the Qin to the Qing dynasties. Learn about Chinese culture, innovations, and interactions with the wider world.',
    category: 'History',
    difficulty: 'intermediate',
  },
  {
    id: 'hist-8',
    title: 'The French Revolution',
    description: 'Examine the political and social upheaval in France from 1789 to 1799. Learn about the causes, radical phases, and lasting impacts on modern governance.',
    category: 'History',
    difficulty: 'intermediate',
  },
  {
    id: 'hist-10',
    title: 'Medieval Europe',
    description: 'Explore European society, politics, and culture from the fall of Rome to the Renaissance. Learn about feudalism, the Catholic Church, and medieval innovations.',
    category: 'History',
    difficulty: 'intermediate',
  }
];

// No advanced history topics in the original data
export const advancedHistoryTopics: Topic[] = [];

// Export all history topics
export const historyTopics: Topic[] = [
  ...beginnerHistoryTopics,
  ...intermediateHistoryTopics,
  ...advancedHistoryTopics
];
