"use client"

import Sidebar from "@/components/Sidebar";
import NewTaskForm from "@/components/NewTaskForm";
import TaskList from "@/components/TaskList";
import { useState, useEffect } from "react";
import TodayTasks from "@/components/TodayTasks";
import UpcomingTasks from "@/components/UpcomingTasks";
import { useSession } from "next-auth/react";
import { TaskLists } from "@/types/types";
import Search from "@/components/Search";
import IndividualTask from "@/components/Task";


export default function Dashboard() {
  const { data: session } = useSession();
  const [clickedTask, setClickedTask] = useState<number | null>(null)
  const [selectedList, setSelectedList] = useState<TaskLists | null>(null)
  const [activeComponent, setActiveComponent] = useState('today')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [allLists, setAllLists] = useState<TaskLists[]>([])
  const [searchValue, setSearchValue] = useState<string>('');

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

  const handleListClick = (list: TaskLists) => {
    setSelectedList(list)
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

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setActiveComponent('search')
  };

  return (
    <main className="main-container">
      <Sidebar
        handleListClick={handleListClick}
        handleTodayClick={handleTodayClick}
        handleUpcomingClick={handleUpcomingClick}
        taskLists={allLists}
        setTaskLists={setAllLists}
        handleSearch={handleSearch}
      />
      {activeComponent === 'taskList' && (
        <TaskList selectedList={selectedList} handleTaskForm={handleFormClick}>
          {selectedList?.tasks.map(task => (
            <IndividualTask task={task} clickedTask={clickedTask} setClickedTask={setClickedTask} key={task?.id} />
          ))}
        </TaskList>
      )}
      {activeComponent === 'today' && (
        <TodayTasks handleTaskForm={handleFormClick} />
      )}
      {activeComponent === 'upcoming' && (
        <UpcomingTasks handleTaskForm={handleFormClick} />
      )}
      {activeComponent === 'search' && (
        <Search searchValue={searchValue} />
      )}
      <NewTaskForm isFormOpen={isFormOpen} handleTaskForm={handleFormClick} lists={allLists} />
    </main>
  )
}