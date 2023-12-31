import Icon from '@mdi/react';
import { mdiChevronDown, mdiChevronUp, mdiTextBoxOutline, mdiTextBoxEditOutline, mdiTextBoxRemoveOutline, mdiCalendarMonth } from '@mdi/js';
import { Task } from '@/types/types';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

type Props = {
  task: Task;
  clickedTask: number | null;
  setClickedTask: React.Dispatch<React.SetStateAction<number | null>>;
  handleEdit: (task: Task) => void;
  handleDelete: (task: Task) => void;
}

export default function IndividualTask({ task, clickedTask, setClickedTask, handleEdit, handleDelete }: Props) {
  return (
    <div className="task-container">
      <span className="task-title" onClick={() => setClickedTask(prevState => prevState === task?.id ? null : task?.id)}>
        <div className="task-title-left">
          {task?.title}
        </div>
        <Icon path={clickedTask === task?.id ? mdiChevronUp : mdiChevronDown} size={1} />
      </span>
      {clickedTask === task?.id && (
        <div className="task-info">
          <span>
            <Icon path={mdiTextBoxOutline} size={1} />
            {task?.description}
          </span>
          <span>
            <Icon path={mdiCalendarMonth} size={1} />
            {new Date(task?.dueDate || "").toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
          <div className="task-info-actions">
            <button onClick={() => handleEdit(task)}>
              <Icon path={mdiTextBoxEditOutline} size={1} />
              Edit task
            </button>
            <button onClick={() => { handleDelete(task); enqueueSnackbar("Successfully deleted the task", { variant: 'success' }) }}>
              <Icon path={mdiTextBoxRemoveOutline} size={1} />
              Delete task
            </button>
          </div>
          <SnackbarProvider />
        </div>
      )}
    </div>
  )
}