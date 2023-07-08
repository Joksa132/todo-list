export type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
}

export type TaskLists = {
  id: number;
  name: string;
  createdAt: Date;
  authorId: number;
  tasks: Task[]
}