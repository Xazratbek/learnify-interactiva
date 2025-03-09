
import { Topic } from './types';

// No beginner math topics in the original data, but we'll add a placeholder array
export const beginnerMathTopics: Topic[] = [];

export const intermediateMathTopics: Topic[] = [
  {
    id: 'math-1',
    title: 'Calculus Fundamentals',
    description: 'Master the principles of differential and integral calculus. Learn about limits, derivatives, integrals, and their applications to real-world problems.',
    category: 'Mathematics',
    difficulty: 'intermediate',
  },
  {
    id: 'math-2',
    title: 'Linear Algebra',
    description: 'Study vectors, matrices, linear transformations, and systems of equations. Learn how these concepts form the foundation of many advanced mathematical applications.',
    category: 'Mathematics',
    difficulty: 'intermediate',
  },
  {
    id: 'math-3',
    title: 'Probability and Statistics',
    description: 'Explore random events, probability distributions, statistical inference, and data analysis. Learn to interpret data and make evidence-based conclusions.',
    category: 'Mathematics',
    difficulty: 'intermediate',
  },
  {
    id: 'math-4',
    title: 'Number Theory',
    description: 'Discover the fascinating properties of integers and prime numbers. Learn about divisibility, modular arithmetic, and cryptographic applications.',
    category: 'Mathematics',
    difficulty: 'intermediate',
  },
  {
    id: 'math-7',
    title: 'Geometry and Topology',
    description: 'Explore shapes, surfaces, and spatial relationships. Learn about Euclidean and non-Euclidean geometries and the properties of topological spaces.',
    category: 'Mathematics',
    difficulty: 'intermediate',
  },
  {
    id: 'math-8',
    title: 'Discrete Mathematics',
    description: 'Study mathematical structures that are fundamentally discrete rather than continuous. Learn about combinatorics, graph theory, and logic.',
    category: 'Mathematics',
    difficulty: 'intermediate',
  },
  {
    id: 'math-10',
    title: 'Applied Mathematics for Engineering',
    description: 'Learn mathematical techniques for solving practical engineering problems. Study numerical methods, optimization, and modeling of physical systems.',
    category: 'Mathematics',
    difficulty: 'intermediate',
  }
];

export const advancedMathTopics: Topic[] = [
  {
    id: 'math-5',
    title: 'Abstract Algebra',
    description: 'Study algebraic structures like groups, rings, and fields. Learn how these abstract concepts unify and generalize various mathematical systems.',
    category: 'Mathematics',
    difficulty: 'advanced',
  },
  {
    id: 'math-6',
    title: 'Differential Equations',
    description: 'Learn to solve and interpret differential equations that model real-world phenomena. Explore applications in physics, engineering, and other fields.',
    category: 'Mathematics',
    difficulty: 'advanced',
  },
  {
    id: 'math-9',
    title: 'Mathematical Logic',
    description: 'Explore formal systems of reasoning, proof theory, and the foundations of mathematics. Learn about propositional and predicate logic.',
    category: 'Mathematics',
    difficulty: 'advanced',
  }
];

// Export all math topics
export const mathTopics: Topic[] = [
  ...beginnerMathTopics,
  ...intermediateMathTopics,
  ...advancedMathTopics
];
