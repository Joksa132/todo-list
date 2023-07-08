"use client"

import { useEffect, useState } from "react"
import Icon from '@mdi/react';
import { mdiPlus, mdiChevronDown, mdiChevronUp, mdiChevronRight, mdiTextBoxOutline, mdiTextBoxEditOutline } from '@mdi/js';
import IndividualTask from "./Task";

type Props = {
  selectedList: {
    id: number | null;
    name: string;
  } | null,
  handleTaskForm: (isOpen: boolean) => void;
}

type Tasks = {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
}

export default function TaskList({ selectedList, handleTaskForm }: Props) {
  const [tasks, setTasks] = useState<Tasks[]>([])
  const [clickedTask, setClickedTask] = useState<number | null>(null)

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
        <h1>{selectedList?.name}</h1>
        <span>{tasks.length}</span>
      </div>
      <button className="new-task-button" onClick={() => handleTaskForm(true)}>
        <Icon path={mdiPlus} size={1} />
        Add New Task
      </button>
      <div className="list-tasks">
        {tasks.map(task => (
          <IndividualTask task={task} clickedTask={clickedTask} setClickedTask={setClickedTask} />
        ))}
      </div>
    </div>
  )
}