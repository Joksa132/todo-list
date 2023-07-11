"use client"

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { Task } from "@/types/types";
import IndividualTask from "./Task";

type Props = {
  handleTaskForm: (isOpen: boolean) => void;
  handleEdit: (task: Task) => void;
}

export default function TodayTasks({ handleTaskForm, handleEdit }: Props) {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([])
  const [clickedTask, setClickedTask] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch(`http://localhost:3000/api/task/today/${session?.user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const data = await res.json();
        if (data.success) {
          setTasks(data.tasks)
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (session) {
      fetchTasks()
    }
  }, [session])

  return (
    <div className="list-container">
      {loading ?
        <div className="loading-spinner"></div>
        :
        <>
          <div className="list-title">
            <h1>Today</h1>
            <span>{tasks.length}</span>
          </div>
          <button className="new-task-button" onClick={() => handleTaskForm(true)}>
            <Icon path={mdiPlus} size={1} />
            Add New Task
          </button>
          <div className="list-tasks">
            {tasks.map(task => (
              <IndividualTask task={task} clickedTask={clickedTask} setClickedTask={setClickedTask} key={task?.id} handleEdit={handleEdit} />
            ))}
          </div>
        </>
      }
    </div>
  )
}