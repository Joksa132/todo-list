"use client"

import { useEffect, useState } from "react"
import Icon from '@mdi/react';
import { mdiPlus, mdiChevronDown, mdiChevronUp, mdiTextBoxOutline, mdiClipboardTextClockOutline, mdiTextBoxEditOutline } from '@mdi/js';

type Props = {
  selectedList: {
    id: number | null;
    name: string;
  },
  handleTaskForm: (isOpen: boolean) => void;
}

type Tasks = {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
}

type ClickedTask = number | null

export default function TaskList({ selectedList, handleTaskForm }: Props) {
  const [tasks, setTasks] = useState<Tasks[]>([])
  const [clickedTask, setClickedTask] = useState<ClickedTask>(null)

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch(`http://localhost:3000/api/task/${selectedList?.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const data = await res.json();
        if (data.success) {
          setTasks(data.tasks)
        }
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    }
    if (selectedList?.id !== null) {
      fetchTasks()
    }
  }, [selectedList])

  return (
    <div className="list-container">
      <div className="list-title">
        <h1>{selectedList.name}</h1>
        <span>{tasks.length}</span>
      </div>
      <button className="new-task-button" onClick={() => handleTaskForm(true)}>
        <Icon path={mdiPlus} size={1} />
        Add New Task
      </button>
      <div className="list-tasks">
        {tasks.map(task => (
          <div className="task-container" key={task?.id}>
            <span className="task-title" onClick={() => setClickedTask(prevState => prevState === task?.id ? null : task?.id)}>
              {task?.title}
              <Icon path={clickedTask === task?.id ? mdiChevronUp : mdiChevronDown} size={1} />
            </span>
            {clickedTask === task?.id && (
              <div className="task-info">
                <span>
                  <Icon path={mdiTextBoxOutline} size={1} />
                  {task?.description}
                </span>
                <span>
                  <Icon path={mdiClipboardTextClockOutline} size={1} />
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
        ))}
      </div>
    </div>
  )
}