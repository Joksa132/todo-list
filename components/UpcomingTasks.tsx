"use client"

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"
import Icon from '@mdi/react';
import { mdiPlus, mdiChevronDown, mdiChevronUp, mdiChevronRight, mdiTextBoxOutline, mdiTextBoxEditOutline } from '@mdi/js';
import { isAfter, isTomorrow, isWithinInterval, setWeek } from "date-fns";
import IndividualTask from "./Task";
import { Task } from "@/types/types";

type Props = {
  handleTaskForm: (isOpen: boolean) => void;
}

export default function UpcomingTasks({ handleTaskForm }: Props) {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([])
  const [clickedTask, setClickedTask] = useState<number | null>(null)

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch(`http://localhost:3000/api/task/upcoming/${session?.user.id}`, {
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
    if (session) {
      fetchTasks()
    }
  }, [session])

  function getTomorrowTasks(tasks: Task[]) {
    const tomorrowTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return isTomorrow(dueDate)
    });
    return tomorrowTasks
  }

  function getWeekTasks(tasks: Task[]) {
    const tomorrow = new Date();
    const nextWeek = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    nextWeek.setDate(nextWeek.getDate() + 7);

    const weekTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return isWithinInterval(dueDate, { start: tomorrow, end: nextWeek });
    });
    return weekTasks
  }

  function getLaterTasks(tasks: Task[]) {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7);

    const laterTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return isAfter(dueDate, nextWeek)
    })
    return laterTasks
  }

  const tomorrowTasks = getTomorrowTasks(tasks)
  const weekTasks = getWeekTasks(tasks)
  const laterTasks = getLaterTasks(tasks)

  return (
    <div className="list-container">
      <div className="list-title">
        <h1>Upcoming</h1>
        <span>{tasks.length}</span>
      </div>
      <button className="new-task-button" onClick={() => handleTaskForm(true)}>
        <Icon path={mdiPlus} size={1} />
        Add New Task
      </button>
      <div className="upcoming-tasks">
        <div className="list-tasks">
          <h3>Tomorrow</h3>
          {tomorrowTasks?.map(task => (
            <IndividualTask task={task} clickedTask={clickedTask} setClickedTask={setClickedTask} key={task?.id} />
          ))}
        </div>
        <div className="list-tasks-bottom">
          <div className="this-week-tasks">
            <h3>This Week</h3>
            {weekTasks?.map(task => (
              <IndividualTask task={task} clickedTask={clickedTask} setClickedTask={setClickedTask} key={task?.id} />
            ))}
          </div>
          <div className="later-tasks">
            <h3>Later Tasks</h3>
            {laterTasks?.map(task => (
              <IndividualTask task={task} clickedTask={clickedTask} setClickedTask={setClickedTask} key={task?.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}