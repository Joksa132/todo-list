export type Task = {
  id: number | null;
  title: string;
  description: string;
  dueDate?: string;
  list?: number | null;
};

export type TaskLists = {
  id: number;
  name: string;
  createdAt: Date;
  authorId: number;
  tasks: Task[];
};
