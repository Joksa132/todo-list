import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { TaskLists } from "@/types/types";

type Props = {
  children: React.ReactNode;
  selectedList: TaskLists | null,
  handleTaskForm: (isOpen: boolean) => void;
}

export default function TaskList({ selectedList, children, handleTaskForm }: Props) {
  return (
    <div className="list-container">
      <div className="list-title">
        <h1>{selectedList?.name}</h1>
        <span>{selectedList?.tasks.length}</span>
      </div>
      <button className="new-task-button" onClick={() => handleTaskForm(true)}>
        <Icon path={mdiPlus} size={1} />
        Add New Task
      </button>
      <div className="list-tasks">
        {children}
      </div>
    </div>
  )
}