
import { Topic } from './types';

export const beginnerBiologyTopics: Topic[] = [
  {
    id: 'bio-7',
    title: 'Plant Biology',
    description: 'Study the structure, function, and diversity of plants. Learn about photosynthesis, plant tissues, reproduction, and plant adaptations.',
    category: 'Biology',
    difficulty: 'beginner',
  }
];

export const intermediateBiologyTopics: Topic[] = [
  {
    id: 'bio-1',
    title: 'Cell Biology',
    description: 'Study the fundamental unit of life and its components. Learn about cell structure, function, division, and how cells form tissues and organisms.',
    category: 'Biology',
    difficulty: 'intermediate',
  },
  {
    id: 'bio-2',
    title: 'Human Anatomy and Physiology',
    description: 'Explore the structure and function of the human body. Learn about organ systems, their integration, and how they maintain homeostasis.',
    category: 'Biology',
    difficulty: 'intermediate',
  },
  {
    id: 'bio-3',
    title: 'Genetics and Heredity',
    description: 'Understand how traits are passed from parents to offspring. Learn about DNA, genes, chromosomes, and patterns of inheritance.',
    category: 'Biology',
    difficulty: 'intermediate',
  },
  {
    id: 'bio-4',
    title: 'Evolution and Natural Selection',
    description: 'Discover how species change over time through natural selection. Learn about evidence for evolution, adaptation, and the history of life on Earth.',
    category: 'Biology',
    difficulty: 'intermediate',
  },
  {
    id: 'bio-5',
    title: 'Ecology and Ecosystems',
    description: 'Study the relationships between organisms and their environments. Learn about energy flow, nutrient cycling, and how species interact in communities.',
    category: 'Biology',
    difficulty: 'intermediate',
  },
  {
    id: 'bio-6',
    title: 'Microbiology',
    description: 'Explore the world of microscopic organisms including bacteria, viruses, and fungi. Learn about their structure, function, and impact on health and ecology.',
    category: 'Biology',
    difficulty: 'intermediate',
  },
  {
    id: 'bio-10',
    title: 'Marine Biology',
    description: 'Explore life in oceans, seas, and other saltwater environments. Learn about marine ecosystems, adaptations, and conservation challenges.',
    category: 'Biology',
    difficulty: 'intermediate',
  }
];

export const advancedBiologyTopics: Topic[] = [
  {
    id: 'bio-8',
    title: 'Neuroscience',
    description: 'Examine the nervous system and brain function. Learn about neurons, synapses, brain regions, and the biological basis of behavior and cognition.',
    category: 'Biology',
    difficulty: 'advanced',
  },
  {
    id: 'bio-9',
    title: 'Immunology',
    description: 'Discover how the body defends against pathogens and disease. Learn about immune cells, antibodies, and the complex mechanisms of immune response.',
    category: 'Biology',
    difficulty: 'advanced',
  }
];

// Export all biology topics
export const biologyTopics: Topic[] = [
  ...beginnerBiologyTopics,
  ...intermediateBiologyTopics,
  ...advancedBiologyTopics
];
