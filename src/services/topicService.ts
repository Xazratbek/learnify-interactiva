import { generateGeminiResponse } from './gemini';

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
    return getExpandedTopics();
  }
};

export const getExpandedTopics = (): Topic[] => {
  return [
    {
      id: 'prog-1',
      title: 'Introduction to Python Programming',
      description: 'Learn the fundamentals of Python, a versatile and beginner-friendly programming language used in web development, data science, and automation.',
      category: 'Programming',
      difficulty: 'beginner',
    },
    {
      id: 'prog-2',
      title: 'Web Development Fundamentals',
      description: 'Explore the core technologies of modern web development including HTML, CSS, and JavaScript. Learn how these technologies work together to create interactive websites.',
      category: 'Programming',
      difficulty: 'beginner',
    },
    {
      id: 'prog-3',
      title: 'Data Structures and Algorithms',
      description: 'Master essential computer science concepts including arrays, linked lists, trees, and sorting algorithms. Learn how these fundamentals power efficient software.',
      category: 'Programming',
      difficulty: 'intermediate',
    },
    {
      id: 'prog-4',
      title: 'Mobile App Development with React Native',
      description: 'Build cross-platform mobile applications using React Native. Learn to create apps that work on both iOS and Android with a single codebase.',
      category: 'Programming',
      difficulty: 'intermediate',
    },
    {
      id: 'prog-5',
      title: 'Database Design and SQL',
      description: 'Learn to design efficient databases and write SQL queries. Understand relational database concepts and how to manage data effectively.',
      category: 'Programming',
      difficulty: 'intermediate',
    },
    {
      id: 'prog-6',
      title: 'Machine Learning Basics',
      description: 'Discover the fundamentals of machine learning algorithms and how they can be implemented in Python. Learn about supervised and unsupervised learning approaches.',
      category: 'Programming',
      difficulty: 'advanced',
    },
    {
      id: 'prog-7',
      title: 'Cloud Computing and AWS',
      description: 'Explore cloud infrastructure and services using Amazon Web Services. Learn to deploy applications, manage servers, and utilize cloud resources.',
      category: 'Programming',
      difficulty: 'intermediate',
    },
    {
      id: 'prog-8',
      title: 'DevOps and CI/CD Pipelines',
      description: 'Understand the principles of DevOps and how to implement continuous integration and continuous deployment. Learn tools like Docker and Jenkins.',
      category: 'Programming',
      difficulty: 'advanced',
    },
    {
      id: 'prog-9',
      title: 'Blockchain Development',
      description: 'Learn the basics of blockchain technology and how to develop applications on platforms like Ethereum. Understand smart contracts and decentralized applications.',
      category: 'Programming',
      difficulty: 'advanced',
    },
    {
      id: 'prog-10',
      title: 'Cybersecurity Fundamentals',
      description: 'Explore core concepts of cybersecurity including encryption, authentication, and network security. Learn to identify and mitigate common security vulnerabilities.',
      category: 'Programming',
      difficulty: 'intermediate',
    },
    
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
      id: 'phys-3',
      title: 'Quantum Mechanics',
      description: 'Discover the strange world of quantum physics where particles behave like waves. Learn about wave functions, uncertainty, and quantum measurement.',
      category: 'Physics',
      difficulty: 'advanced',
    },
    {
      id: 'phys-4',
      title: 'Thermodynamics',
      description: 'Study energy transfer, heat, work, and the laws that govern thermal systems. Learn how temperature and entropy relate to energy transformations.',
      category: 'Physics',
      difficulty: 'intermediate',
    },
    {
      id: 'phys-5',
      title: 'Introduction to Relativity',
      description: 'Understand Einstein\'s theories of special and general relativity. Learn how space, time, mass, and energy are interconnected in surprising ways.',
      category: 'Physics',
      difficulty: 'advanced',
    },
    {
      id: 'phys-6',
      title: 'Optics and Waves',
      description: 'Study light, lenses, mirrors, and wave phenomena. Learn about reflection, refraction, diffraction, and other principles of wave behavior.',
      category: 'Physics',
      difficulty: 'intermediate',
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
    },
    {
      id: 'phys-10',
      title: 'Physics of Simple Machines',
      description: 'Understand the physics behind levers, pulleys, inclined planes, and other simple machines. Learn how these devices multiply force and enable work.',
      category: 'Physics',
      difficulty: 'beginner',
    },
    
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
      id: 'math-9',
      title: 'Mathematical Logic',
      description: 'Explore formal systems of reasoning, proof theory, and the foundations of mathematics. Learn about propositional and predicate logic.',
      category: 'Mathematics',
      difficulty: 'advanced',
    },
    {
      id: 'math-10',
      title: 'Applied Mathematics for Engineering',
      description: 'Learn mathematical techniques for solving practical engineering problems. Study numerical methods, optimization, and modeling of physical systems.',
      category: 'Mathematics',
      difficulty: 'intermediate',
    },
    
    {
      id: 'hist-1',
      title: 'Ancient Civilizations',
      description: 'Explore the rise and fall of early human societies including Mesopotamia, Egypt, Greece, and Rome. Learn how these cultures shaped our modern world.',
      category: 'History',
      difficulty: 'beginner',
    },
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
      id: 'hist-5',
      title: 'History of Colonial America',
      description: 'Explore the European colonization of North America and the formation of the United States. Learn about colonial life, the American Revolution, and early republic.',
      category: 'History',
      difficulty: 'beginner',
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
      id: 'hist-9',
      title: 'The Civil Rights Movement',
      description: 'Study the struggle for racial equality in the United States from the 1950s to 1960s. Learn about key leaders, protests, legislation, and ongoing challenges.',
      category: 'History',
      difficulty: 'beginner',
    },
    {
      id: 'hist-10',
      title: 'Medieval Europe',
      description: 'Explore European society, politics, and culture from the fall of Rome to the Renaissance. Learn about feudalism, the Catholic Church, and medieval innovations.',
      category: 'History',
      difficulty: 'intermediate',
    },
    
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
      id: 'bio-7',
      title: 'Plant Biology',
      description: 'Study the structure, function, and diversity of plants. Learn about photosynthesis, plant tissues, reproduction, and plant adaptations.',
      category: 'Biology',
      difficulty: 'beginner',
    },
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
    },
    {
      id: 'bio-10',
      title: 'Marine Biology',
      description: 'Explore life in oceans, seas, and other saltwater environments. Learn about marine ecosystems, adaptations, and conservation challenges.',
      category: 'Biology',
      difficulty: 'intermediate',
    },
    
    {
      id: 'chem-1',
      title: 'Periodic Table and Elements',
      description: 'Learn about the organization of elements and their properties. Understand periodic trends, electron configurations, and how elements form compounds.',
      category: 'Chemistry',
      difficulty: 'beginner',
    },
    {
      id: 'chem-2',
      title: 'Chemical Bonding',
      description: 'Explore how atoms combine to form molecules through different types of bonds. Learn about ionic, covalent, and metallic bonding.',
      category: 'Chemistry',
      difficulty: 'intermediate',
    },
    {
      id: 'chem-3',
      title: 'Organic Chemistry',
      description: 'Study carbon-based compounds and their reactions. Learn about hydrocarbons, functional groups, and the chemistry of biological molecules.',
      category: 'Chemistry',
      difficulty: 'advanced',
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
      id: 'chem-6',
      title: 'Biochemistry',
      description: 'Explore the chemical processes and substances that occur within living organisms. Learn about proteins, carbohydrates, lipids, and nucleic acids.',
      category: 'Chemistry',
      difficulty: 'advanced',
    },
    {
      id: 'chem-7',
      title: 'Electrochemistry',
      description: 'Study chemical reactions that involve the transfer of electrons. Learn about redox reactions, electrochemical cells, and electrolysis.',
      category: 'Chemistry',
      difficulty: 'intermediate',
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
    },
    {
      id: 'chem-10',
      title: 'Industrial Chemistry',
      description: 'Study the application of chemical processes in manufacturing. Learn about catalysis, polymers, pharmaceuticals, and other industrial applications.',
      category: 'Chemistry',
      difficulty: 'intermediate',
    },
    
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
      id: 'lit-3',
      title: 'World Mythology',
      description: 'Study myths and legends from cultures around the world. Learn how these stories reflect human experiences and continue to influence modern narratives.',
      category: 'Literature',
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
      id: 'lit-4',
      title: 'Poetry Analysis and Composition',
      description: 'Explore poetic forms, devices, and traditions. Learn to analyze poetry and experiment with writing your own verses in various styles.',
      category: 'Literature',
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
      id: 'lit-5',
      title: 'Contemporary World Literature',
      description: 'Discover important literary works from around the globe written in the past few decades. Explore diverse perspectives on modern human experiences.',
      category: 'Literature',
      difficulty: 'intermediate',
    },
    {
      id: 'art-5',
      title: 'Introduction to Architecture',
      description: 'Study the art and science of designing buildings and structures. Learn about architectural history, styles, principles, and famous landmarks.',
      category: 'Art',
      difficulty: 'intermediate',
    },
  ];
};
