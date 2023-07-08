"use client"

import Sidebar from "@/components/Sidebar";
import NewTaskForm from "@/components/NewTaskForm";
import TaskList from "@/components/TaskList";
import styles from "./dashboard.module.css"
import { useState, useEffect } from "react";
import TodayTasks from "@/components/TodayTasks";
import UpcomingTasks from "@/components/UpcomingTasks";
import { useSession } from "next-auth/react";
import { TaskLists } from "@/types/types";

type SelectedList = {
  id: number | null;
  name: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [selectedList, setSelectedList] = useState<SelectedList | null>(null)
  const [activeComponent, setActiveComponent] = useState('today')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [allLists, setAllLists] = useState<TaskLists[]>([])

  useEffect(() => {
    async function fetchLists() {
      try {
        const res = await fetch(`http://localhost:3000/api/list/${session?.user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const data = await res.json();
        if (data.success) {
          setAllLists(data.taskLists)
        }
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    }
    if (session) {
      fetchLists()
    }
  }, [session])

  const handleListClick = (listId: number, listName: string) => {
    setSelectedList({ id: listId, name: listName })
    setActiveComponent('taskList')
  }

  const handleTodayClick = () => {
    setSelectedList(null);
    setActiveComponent('today');
  }

  const handleUpcomingClick = () => {
    setSelectedList(null);
    setActiveComponent('upcoming');
  }

  const handleFormClick = (formState: boolean) => {
    setIsFormOpen(formState)
  }

  return (
    <main className={styles["main-container"]}>
      <Sidebar
        handleListClick={handleListClick}
        handleTodayClick={handleTodayClick}
        handleUpcomingClick={handleUpcomingClick}
        taskLists={allLists}
        setTaskLists={setAllLists}
      />
      {activeComponent === 'taskList' && (
        <TaskList selectedList={selectedList} handleTaskForm={handleFormClick} />
      )}
      {activeComponent === 'today' && (
        <TodayTasks handleTaskForm={handleFormClick} />
      )}
      {activeComponent === 'upcoming' && (
        <UpcomingTasks handleTaskForm={handleFormClick} />
      )}
      <NewTaskForm isFormOpen={isFormOpen} handleTaskForm={handleFormClick} lists={allLists} />
    </main>
  )
}