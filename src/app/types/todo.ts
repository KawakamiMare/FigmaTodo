export type Priority = 'high' | 'medium' | 'low';
export type Status = 'not_started' | 'in_progress' | 'almost_done' | 'stopped';

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  status?: Status;
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
