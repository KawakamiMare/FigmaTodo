export type Priority = 'high' | 'medium' | 'low';

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  deadline?: string;
  priority: Priority;
  description?: string;
  labels?: string[];
}

export interface AppSettings {
  backgroundType: 'gradient' | 'color' | 'image' | 'custom';
  backgroundColor?: string;
  backgroundImage?: string;
  customImageUrl?: string;
}
