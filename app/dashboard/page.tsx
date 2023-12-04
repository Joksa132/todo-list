"use client";

import Sidebar from "@/components/Sidebar";
import NewTaskForm, { Task } from "@/components/NewTaskForm";
import TaskList from "@/components/tasks/TaskList";
import { useState, useEffect } from "react";
import TodayTasks from "@/components/tasks/TodayTasks";
import UpcomingTasks from "@/components/tasks/UpcomingTasks";
import { useSession } from "next-auth/react";
import { TaskLists } from "@/types/types";
import Search from "@/components/Search";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeComponent, setActiveComponent] = useState<string | number>(
    "today"
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [allLists, setAllLists] = useState<TaskLists[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isNewTask, setIsNewTask] = useState<boolean>(false);

  useEffect(() => {
    if (session) {
      fetchLists();
    }
  }, [session]);

  async function fetchLists() {
    try {
      const res = await fetch(`/api/list/${session?.user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        setAllLists(data.taskLists);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSidebarClick = (option: string | number) => {
    setActiveComponent(option);
  };

  const handleFormClick = (formState: boolean) => {
    setIsFormOpen(formState);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setActiveComponent("search");
  };

  const handleEdit = (task: Task) => {
    setIsFormOpen(true);
    setEditTask(task);
  };

  return (
    <main className="main-container">
      <Sidebar
        handleSidebarClick={handleSidebarClick}
        taskLists={allLists}
        setTaskLists={setAllLists}
        handleSearch={handleSearch}
      />
      {activeComponent &&
        activeComponent !== "today" &&
        activeComponent !== "upcoming" && (
          <TaskList
            handleTaskForm={handleFormClick}
            activeComponent={activeComponent}
            isNewTask={isNewTask}
            setIsNewTask={setIsNewTask}
            handleEdit={handleEdit}
          />
        )}
      {activeComponent === "today" && (
        <TodayTasks
          handleTaskForm={handleFormClick}
          handleEdit={handleEdit}
          isNewTask={isNewTask}
          setIsNewTask={setIsNewTask}
        />
      )}
      {activeComponent === "upcoming" && (
        <UpcomingTasks
          handleTaskForm={handleFormClick}
          handleEdit={handleEdit}
          isNewTask={isNewTask}
          setIsNewTask={setIsNewTask}
        />
      )}
      {activeComponent === "search" && (
        <Search searchValue={searchValue} handleEdit={handleEdit} />
      )}
      <NewTaskForm
        isFormOpen={isFormOpen}
        handleTaskForm={handleFormClick}
        lists={allLists}
        isEdit={editTask}
        key={editTask?.id}
        setIsNewTask={setIsNewTask}
      />
    </main>
  );
}
