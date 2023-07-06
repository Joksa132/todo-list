"use client"

import { useEffect, useState } from "react"
import Icon from '@mdi/react';
import { mdiPlus, mdiChevronDown, mdiChevronUp } from '@mdi/js';

type Props = {
  selectedList: {
    id: number | null;
    name: string;
  }
}

type Tasks = {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
}

export default function TaskList({ selectedList }: Props) {
  const [tasks, setTasks] = useState<Tasks[]>([])

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

  console.log(tasks)

  return (
    <div className="list-container">
      <div className="list-title">
        <h1>{selectedList.name}</h1>
        <span>{tasks.length}</span>
      </div>
      <button>
        <Icon path={mdiPlus} size={1} />
        Add New Task
      </button>
      <div className="list-tasks">
        {tasks.map(task => (
          <span>
            {task?.title}
            <Icon path={mdiChevronDown} size={1} />
          </span>
        ))}
      </div>
    </div>
  )
}