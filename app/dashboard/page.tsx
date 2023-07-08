"use client"

import Sidebar from "@/components/Sidebar";
import NewTaskForm from "@/components/NewTaskForm";
import TaskList from "@/components/TaskList";
import styles from "./dashboard.module.css"
import { useState } from "react";
import TodayTasks from "@/components/TodayTasks";
import UpcomingTasks from "@/components/UpcomingTasks";

type List = {
  id: number | null;
  name: string;
}

export default function Dashboard() {
  const [selectedList, setSelectedList] = useState<List | null>(null)
  const [activeComponent, setActiveComponent] = useState('today')
  const [isFormOpen, setIsFormOpen] = useState(false)

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
      <Sidebar handleListClick={handleListClick} handleTodayClick={handleTodayClick} handleUpcomingClick={handleUpcomingClick} />
      {activeComponent === 'taskList' && (
        <TaskList selectedList={selectedList} handleTaskForm={handleFormClick} />
      )}
      {activeComponent === 'today' && (
        <TodayTasks handleTaskForm={handleFormClick} />
      )}
      {activeComponent === 'upcoming' && (
        <UpcomingTasks />
      )}
      <NewTaskForm isFormOpen={isFormOpen} handleTaskForm={handleFormClick} />
    </main>
  )
}