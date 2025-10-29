// The shape of a Task
export interface TaskItem {
  id: string;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  dependencyIds: string[]; // <-- THIS IS THE FIX
}

// The shape of a Project (including its tasks)
export interface Project {
  id: string;
  title: string;
  description?: string;
  creationDate: string;
  tasks: TaskItem[];
}