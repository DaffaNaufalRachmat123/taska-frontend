// src/types/index.ts
export interface Task {
  id: string;
  name: string;
  sprint: string;
  status: string; // Atau status lain yang relevan
  type: string;
}