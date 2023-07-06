"use client"

import Sidebar from "@/components/Sidebar";
import styles from "./dashboard.module.css"
import NewTaskForm from "@/components/NewTaskForm";
import { useState } from "react";
import TaskList from "@/components/TaskList";

type List = {
  id: number | null;
  name: string;
}

export default function Dashboard() {
  const [selectedList, setSelectedList] = useState<List>({
    id: null,
    name: ''
  })

  const handleListClick = (listId: number, listName: string) => {
    setSelectedList({ id: listId, name: listName })
  }

  return (
    <main className={styles["main-container"]}>
      <Sidebar handleListClick={handleListClick} />
      <TaskList selectedList={selectedList} />
      <NewTaskForm />
    </main>
  )
}