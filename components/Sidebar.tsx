"use client"

import { signOut, useSession } from "next-auth/react";
import Icon from '@mdi/react';
import { mdiCalendarMonth, mdiCalendarArrowRight, mdiCalendarCheck, mdiLogout, mdiPlus } from '@mdi/js';
import { useEffect, useState } from "react";

type TaskList = {
  id: number;
  name: string;
  createdAt: Date;
}

export default function Sidebar() {
  const { data: session } = useSession();
  const [isNewListClicked, setIsNewListClicked] = useState(false)
  const [newList, setNewList] = useState('')
  const [taskLists, setTaskLists] = useState<TaskList[]>([])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const res = await fetch('http://localhost:3000/api/list/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newList,
          email: session?.user?.email
        })
      })

      const data = await res.json();
      if (data.success) {
        setTaskLists((prevLists: TaskList[]) => [...prevLists, data.newList])
        setNewList('')
      }
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <nav>
      <section className="sidebar-task-section">
        <div className="search-bar">
          <h2>Menu</h2>
          <input type="text" name="search-tasks" id="search-tasks" placeholder="Search"></input>
        </div>
        <div className="tasks-container">
          <h4>Tasks</h4>
          <span>
            <Icon path={mdiCalendarCheck} size={1} />
            Today
          </span>
          <span>
            <Icon path={mdiCalendarArrowRight} size={1} />
            Upcoming
          </span>
          <span>
            <Icon path={mdiCalendarMonth} size={1} />
            Calendar
          </span>
        </div>
        <div className="lists-container">
          <h4>Lists</h4>
          {taskLists.map(list => (
            <span>{list.name}</span>
          ))}
          <span onClick={() => { setIsNewListClicked(!isNewListClicked) }}>
            <Icon path={mdiPlus} size={1} />
            Add New List
          </span>
          {isNewListClicked &&
            <form onSubmit={handleSubmit}>
              <input type="text" name="list-name" id="list-name" placeholder="List Name" onChange={(e) => setNewList(e.target.value)} />
              <button type="submit">Save List</button>
            </form>
          }
        </div>
      </section>
      <section className="sidebar-user-section">
        <h4>{session?.user?.name}</h4>
        <span onClick={() => signOut()}>
          <Icon path={mdiLogout} size={1} />
          <button>Sign out</button>
        </span>
      </section>
    </nav>
  )
}