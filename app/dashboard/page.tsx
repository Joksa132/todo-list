"use client"

import Sidebar from "@/components/Sidebar";
import styles from "./dashboard.module.css"
import NewTaskForm from "@/components/NewTaskForm";
import { useState } from "react";
import TaskList from "@/components/TaskList";

export default function Dashboard() {
  const [selectedList, setSelectedList] = useState<number | null>(null)

  const handleListClick = (listName: number) => {
    setSelectedList(listName)
  }

  return (
    <main className={styles["main-container"]}>
      <Sidebar handleListClick={handleListClick} />
      <TaskList selectedList={selectedList} />
      <NewTaskForm />
    </main>
  )
}