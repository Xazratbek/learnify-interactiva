
import { Topic } from './types';

export const literatureTopics: Topic[] = [
  {
    id: 'lit-1',
    title: 'Introduction to Literary Analysis',
    description: 'Learn how to analyze and interpret literature by examining theme, character, plot, and style. Develop critical reading skills applicable to various genres.',
    category: 'Literature',
    difficulty: 'beginner',
  },
  {
    id: 'lit-2',
    title: 'Shakespeare\'s Major Works',
    description: 'Explore the plays and sonnets of William Shakespeare. Learn about his influence on language, storytelling, and representations of human nature.',
    category: 'Literature',
    difficulty: 'intermediate',
  },
  {
    id: 'lit-3',
    title: 'World Mythology',
    description: 'Study myths and legends from cultures around the world. Learn how these stories reflect human experiences and continue to influence modern narratives.',
    category: 'Literature',
    difficulty: 'beginner',
  },
  {
    id: 'lit-4',
    title: 'Poetry Analysis and Composition',
    description: 'Explore poetic forms, devices, and traditions. Learn to analyze poetry and experiment with writing your own verses in various styles.',
    category: 'Literature',
    difficulty: 'intermediate',
  },
  {
    id: 'lit-5',
    title: 'Contemporary World Literature',
    description: 'Discover important literary works from around the globe written in the past few decades. Explore diverse perspectives on modern human experiences.',
    category: 'Literature',
    difficulty: 'intermediate',
  }
];

export const artTopics: Topic[] = [
  {
    id: 'art-1',
    title: 'Art History: Renaissance to Modern',
    description: 'Survey major art movements from the Renaissance through Modernism. Learn about influential artists, techniques, and the cultural contexts of important works.',
    category: 'Art',
    difficulty: 'intermediate',
  },
  {
    id: 'art-2',
    title: 'Music Theory Fundamentals',
    description: 'Understand the building blocks of music including scales, chords, rhythm, and form. Learn how these elements combine to create musical compositions.',
    category: 'Music',
    difficulty: 'beginner',
  },
  {
    id: 'art-3',
    title: 'Film Studies',
    description: 'Analyze the language and techniques of cinema. Learn about film history, genres, directors, and how to critically interpret visual storytelling.',
    category: 'Art',
    difficulty: 'intermediate',
  },
  {
    id: 'art-4',
    title: 'Principles of Photography',
    description: 'Learn the technical and compositional elements of creating compelling photographs. Study exposure, lighting, composition, and digital editing.',
    category: 'Art',
    difficulty: 'beginner',
  },
  {
    id: 'art-5',
    title: 'Introduction to Architecture',
    description: 'Study the art and science of designing buildings and structures. Learn about architectural history, styles, principles, and famous landmarks.',
    category: 'Art',
    difficulty: 'intermediate',
  }
];

// Combine literature and art topics
export const literatureAndArtTopics: Topic[] = [
  ...literatureTopics,
  ...artTopics
];
