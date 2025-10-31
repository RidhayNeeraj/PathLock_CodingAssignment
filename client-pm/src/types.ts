export interface TaskItem {
  id: string;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  dependencyIds: string[]; 
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  creationDate: string;
  tasks: TaskItem[];
}