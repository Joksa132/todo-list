"use client"

import Sidebar from "@/components/Sidebar";
import NewTaskForm from "@/components/NewTaskForm";
import TaskList from "@/components/TaskList";
import styles from "./dashboard.module.css"
import { useState } from "react";

type List = {
  id: number | null;
  name: string;
}

export default function Dashboard() {
  const [selectedList, setSelectedList] = useState<List>({
    id: null,
    name: ''
  })
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleListClick = (listId: number, listName: string) => {
    setSelectedList({ id: listId, name: listName })
  }

  const handleFormClick = (formState: boolean) => {
    setIsFormOpen(formState)
  }

  return (
    <main className={styles["main-container"]}>
      <Sidebar handleListClick={handleListClick} />
      <TaskList selectedList={selectedList} handleTaskForm={handleFormClick} />
      <NewTaskForm isFormOpen={isFormOpen} handleTaskForm={handleFormClick} />
    </main>
  )
}