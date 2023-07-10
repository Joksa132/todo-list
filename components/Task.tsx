import Icon from '@mdi/react';
import { mdiChevronDown, mdiChevronUp, mdiChevronRight, mdiTextBoxOutline, mdiTextBoxEditOutline } from '@mdi/js';
import { Task } from '@/types/types';

type Props = {
  task: Task;
  clickedTask: number | null;
  setClickedTask: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function IndividualTask({ task, clickedTask, setClickedTask }: Props) {

  return (
    <div className="task-container" key={task?.id}>
      <span className="task-title" onClick={() => setClickedTask(prevState => prevState === task?.id ? null : task?.id)}>
        <div className="task-title-left">
          <Icon path={mdiTextBoxOutline} size={1} />
          {task?.title}
        </div>
        <Icon path={clickedTask === task?.id ? mdiChevronUp : mdiChevronDown} size={1} />
      </span>
      {clickedTask === task?.id && (
        <div className="task-info">
          <span>
            <Icon path={mdiChevronRight} size={1} />
            {task?.description}
          </span>
          <span>
            <Icon path={mdiChevronRight} size={1} />
            {new Date(task?.dueDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
          <button>
            <Icon path={mdiTextBoxEditOutline} size={1} />
            Edit task</button>
        </div>
      )}
    </div>
  )
}