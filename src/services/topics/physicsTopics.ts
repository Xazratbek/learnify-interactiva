
import { Topic } from './types';

// Physics topics organized by difficulty
export const beginnerPhysicsTopics: Topic[] = [
  {
    id: 'phys-b-1',
    title: 'Introduction to Physics',
    description: 'Learn the basic principles of physics including motion, forces, energy, and simple machines. Understand how physics explains the world around us.',
    category: 'Physics',
    difficulty: 'beginner',
  },
  {
    id: 'phys-b-2',
    title: 'Physics of Simple Machines',
    description: 'Understand the physics behind levers, pulleys, inclined planes, and other simple machines. Learn how these devices multiply force and enable work.',
    category: 'Physics',
    difficulty: 'beginner',
  },
  {
    id: 'phys-b-3',
    title: 'Sound and Waves for Beginners',
    description: 'Explore the nature of sound and waves. Learn about frequency, amplitude, wavelength, and how sound travels through different mediums.',
    category: 'Physics',
    difficulty: 'beginner',
  },
  {
    id: 'phys-b-4',
    title: 'Light and Color',
    description: 'Discover the physics of light and color. Learn about reflection, refraction, the visible spectrum, and how we perceive different colors.',
    category: 'Physics',
    difficulty: 'beginner',
  }
];

export const intermediatePhysicsTopics: Topic[] = [
  {
    id: 'phys-1',
    title: 'Classical Mechanics',
    description: 'Study the motion of objects and the forces that affect them. Learn Newton\'s laws, momentum, energy conservation, and rotational motion.',
    category: 'Physics',
    difficulty: 'intermediate',
  },
  {
    id: 'phys-2',
    title: 'Electromagnetism',
    description: 'Explore electric and magnetic fields, electromagnetic waves, and their applications. Learn how these forces influence charged particles and create radiation.',
    category: 'Physics',
    difficulty: 'intermediate',
  },
  {
    id: 'phys-4',
    title: 'Thermodynamics',
    description: 'Study energy transfer, heat, work, and the laws that govern thermal systems. Learn how temperature and entropy relate to energy transformations.',
    category: 'Physics',
    difficulty: 'intermediate',
  },
  {
    id: 'phys-6',
    title: 'Optics and Waves',
    description: 'Study light, lenses, mirrors, and wave phenomena. Learn about reflection, refraction, diffraction, and other principles of wave behavior.',
    category: 'Physics',
    difficulty: 'intermediate',
  }
];

export const advancedPhysicsTopics: Topic[] = [
  {
    id: 'phys-3',
    title: 'Quantum Mechanics',
    description: 'Discover the strange world of quantum physics where particles behave like waves. Learn about wave functions, uncertainty, and quantum measurement.',
    category: 'Physics',
    difficulty: 'advanced',
  },
  {
    id: 'phys-5',
    title: 'Introduction to Relativity',
    description: 'Understand Einstein\'s theories of special and general relativity. Learn how space, time, mass, and energy are interconnected in surprising ways.',
    category: 'Physics',
    difficulty: 'advanced',
  },
  {
    id: 'phys-7',
    title: 'Astrophysics',
    description: 'Explore the physics of stars, galaxies, and the universe. Learn about stellar evolution, cosmology, and the fundamental forces that shape our cosmos.',
    category: 'Physics',
    difficulty: 'advanced',
  },
  {
    id: 'phys-8',
    title: 'Nuclear Physics',
    description: 'Study atomic nuclei, radioactivity, and nuclear reactions. Learn about fission, fusion, and applications of nuclear science.',
    category: 'Physics',
    difficulty: 'advanced',
  },
  {
    id: 'phys-9',
    title: 'Solid State Physics',
    description: 'Examine the properties of solid materials and their applications. Learn about crystal structures, semiconductors, and electronic properties of materials.',
    category: 'Physics',
    difficulty: 'advanced',
  }
];

// Export all physics topics
export const physicsTopics: Topic[] = [
  ...beginnerPhysicsTopics,
  ...intermediatePhysicsTopics,
  ...advancedPhysicsTopics
];
