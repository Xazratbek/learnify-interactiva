
import { Topic } from './types';

export const beginnerChemistryTopics: Topic[] = [
  {
    id: 'chem-1',
    title: 'Periodic Table and Elements',
    description: 'Learn about the organization of elements and their properties. Understand periodic trends, electron configurations, and how elements form compounds.',
    category: 'Chemistry',
    difficulty: 'beginner',
  }
];

export const intermediateChemistryTopics: Topic[] = [
  {
    id: 'chem-2',
    title: 'Chemical Bonding',
    description: 'Explore how atoms combine to form molecules through different types of bonds. Learn about ionic, covalent, and metallic bonding.',
    category: 'Chemistry',
    difficulty: 'intermediate',
  },
  {
    id: 'chem-4',
    title: 'Acids, Bases, and pH',
    description: 'Understand acid-base reactions, pH scale, and buffer systems. Learn how these concepts apply to biological systems and industrial processes.',
    category: 'Chemistry',
    difficulty: 'intermediate',
  },
  {
    id: 'chem-5',
    title: 'Thermochemistry',
    description: 'Study the energy changes in chemical reactions. Learn about enthalpy, entropy, free energy, and how to predict spontaneous reactions.',
    category: 'Chemistry',
    difficulty: 'intermediate',
  },
  {
    id: 'chem-7',
    title: 'Electrochemistry',
    description: 'Study chemical reactions that involve the transfer of electrons. Learn about redox reactions, electrochemical cells, and electrolysis.',
    category: 'Chemistry',
    difficulty: 'intermediate',
  },
  {
    id: 'chem-10',
    title: 'Industrial Chemistry',
    description: 'Study the application of chemical processes in manufacturing. Learn about catalysis, polymers, pharmaceuticals, and other industrial applications.',
    category: 'Chemistry',
    difficulty: 'intermediate',
  }
];

export const advancedChemistryTopics: Topic[] = [
  {
    id: 'chem-3',
    title: 'Organic Chemistry',
    description: 'Study carbon-based compounds and their reactions. Learn about hydrocarbons, functional groups, and the chemistry of biological molecules.',
    category: 'Chemistry',
    difficulty: 'advanced',
  },
  {
    id: 'chem-6',
    title: 'Biochemistry',
    description: 'Explore the chemical processes and substances that occur within living organisms. Learn about proteins, carbohydrates, lipids, and nucleic acids.',
    category: 'Chemistry',
    difficulty: 'advanced',
  },
  {
    id: 'chem-8',
    title: 'Analytical Chemistry',
    description: 'Learn techniques for separating, identifying, and quantifying matter. Study spectroscopy, chromatography, and other analytical methods.',
    category: 'Chemistry',
    difficulty: 'advanced',
  },
  {
    id: 'chem-9',
    title: 'Nuclear Chemistry',
    description: 'Explore the changes in atomic nuclei during chemical reactions. Learn about radioactivity, nuclear reactions, and applications of radioisotopes.',
    category: 'Chemistry',
    difficulty: 'advanced',
  }
];

// Export all chemistry topics
export const chemistryTopics: Topic[] = [
  ...beginnerChemistryTopics,
  ...intermediateChemistryTopics,
  ...advancedChemistryTopics
];
