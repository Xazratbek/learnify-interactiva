
export interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  imageUrl?: string;
}

export type TopicsByDifficulty = {
  beginner: Topic[];
  intermediate: Topic[];
  advanced: Topic[];
};
