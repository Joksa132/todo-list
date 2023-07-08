"use client"

import { useSession } from "next-auth/react";
import { useState } from "react"
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { TaskLists } from "@/types/types";

type Task = {
  title: string;
  description: string;
  list: number | null;
  date: string;
}

type Props = {
  isFormOpen: boolean,
  handleTaskForm: (isOpen: boolean) => void,
  lists: TaskLists[]
}

export default function NewTaskForm({ isFormOpen, handleTaskForm, lists }: Props) {
  const { data: session } = useSession()
  const [task, setTask] = useState<Task>({
    title: '',
    description: '',
    list: null,
    date: '',
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:3000/api/task/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          task,
          id: session?.user.id
        })
      })

      const data = await res.json();
      if (data.success) {
        setTask({
          title: '',
          description: '',
          date: '',
          list: null
        })
      }
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {isFormOpen && (
        <form className="new-task-form" onSubmit={handleSubmit}>
          <div className="new-task-top">
            <h2>
              New Task:
              <span onClick={() => handleTaskForm(false)}>
                <Icon path={mdiClose} size={1} />
              </span>
            </h2>
            <input
              type="text"
              name="task-title"
              id="task-title"
              placeholder="Title"
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              value={task?.title}
              required
            />
            <textarea
              name="task-description"
              id="task-description"
              placeholder="Description"
              rows={7}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              value={task?.description}
            />
            <div className="new-task-info">
              <label>List:</label>
              <select onChange={(e) => setTask({ ...task, list: parseInt(e.target.value) })} required>
                {lists.map(list => (
                  <option key={list?.id} value={list?.id}>{list?.name}</option>
                ))}
              </select>
            </div>
            <div className="new-task-info">
              <label>Due date:</label>
              <input type="date" onChange={(e) => setTask({ ...task, date: e.target.value })} required />
            </div>
          </div>
          <button>Save task</button>
        </form>
      )}
    </>
  )
}