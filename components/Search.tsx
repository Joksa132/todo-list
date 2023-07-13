"use client"

import { Task } from "@/types/types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"
import IndividualTask from "./Task";

type Props = {
  searchValue: string;
  handleEdit: (task: Task) => void;
  handleDelete: (task: Task) => void;
}

export default function Search({ searchValue, handleEdit, handleDelete }: Props) {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([])
  const [clickedTask, setClickedTask] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchTasks() {
      try {
        const queryString = new URLSearchParams({
          searchValue: encodeURIComponent(searchValue)
        }).toString();

        const res = await fetch(`/api/search/${session?.user?.id}?${queryString}`, {
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
  }, [session, searchValue])

  return (
    <div className="list-container">
      {loading ?
        <div className="loading-spinner"></div>
        :
        <>
          {tasks.length ?
            <>
              <div className="list-title">
                <h1>Search results for <i>{searchValue}</i></h1>
                <span>{tasks.length}</span>
              </div>

              <div className="list-tasks">
                {tasks.map(task => (
                  <IndividualTask
                    task={task}
                    clickedTask={clickedTask}
                    setClickedTask={setClickedTask}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    key={task?.id}
                  />
                ))}
              </div>
            </>
            :
            <div className="list-title">
              <h1>There are no results for <i>{searchValue}</i></h1>
            </div>
          }
        </>
      }
    </div>
  )
}