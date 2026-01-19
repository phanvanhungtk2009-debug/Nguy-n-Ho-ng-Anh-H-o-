export interface University {
  id: string;
  code: string;
  name: string;
  city: string;
  logo: string;
  type: 'Public' | 'Private' | 'International';
  description: string;
  website: string;
  established: number;
}

export interface Major {
  id: string;
  universityId: string;
  code: string;
  name: string;
  group: string; // e.g., CNTT, Kinh tế
  description: string;
}

export interface Cutoff {
  majorId: string;
  year: number;
  method: string; // e.g., THPT, DGNL
  score: number;
  scale: number; // e.g., 30, 40, 1200
  combinations: string[]; // e.g., ["A00", "A01"]
  note?: string;
}

export interface Tuition {
  majorId: string;
  year: string;
  min: number; // in million VND
  max: number; // in million VND
  unit: string; // e.g., "năm", "tín chỉ"
}

export interface SearchFilters {
  keyword: string;
  city: string;
  group: string;
  combination: string;
}

export type ChatMessage = {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  groundingLinks?: { title: string; uri: string }[];
};
