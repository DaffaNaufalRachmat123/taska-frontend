// src/types/index.ts
export interface Task {
  id: string;
  title: string;
  project: string;
  type: 'completed' | 'new'; // Atau status lain yang relevan
}