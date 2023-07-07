"use client"

import { signOut, useSession } from "next-auth/react";
import Icon from '@mdi/react';
import { mdiCalendarMonth, mdiCalendarArrowRight, mdiCalendarCheck, mdiLogout, mdiPlus, mdiListBoxOutline, mdiMenu } from '@mdi/js';
import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
}

type TaskList = {
  id: number;
  name: string;
  createdAt: Date;
  authorId: number;
  tasks: Task[];
}

type Props = {
  handleListClick: (listId: number, listName: string) => void
};

export default function Sidebar({ handleListClick }: Props) {
  const { data: session } = useSession();
  const [isNewListClicked, setIsNewListClicked] = useState(false)
  const [newList, setNewList] = useState('')
  const [taskLists, setTaskLists] = useState<TaskList[]>([])
  const [isToggled, setIsToggled] = useState(false)

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
          setTaskLists(data.taskLists)
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
    <nav className={isToggled ? "nav-toggled" : ""}>
      {isToggled ?
        <div className="menu-icon" onClick={() => setIsToggled(prevState => !prevState)}>
          <Icon path={mdiMenu} size={1.2} style={{ cursor: "pointer" }} />
        </div>
        :
        <>
          <section className="sidebar-task-section">
            <div className="search-bar">
              <h2>
                Menu
                <span onClick={() => setIsToggled(prevState => !prevState)}>
                  <Icon path={mdiMenu} size={1} />
                </span>
              </h2>
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
                <div className="individual-list">
                  <span key={list?.id} onClick={() => handleListClick(list?.id, list?.name)}>
                    <Icon path={mdiListBoxOutline} size={1} />
                    {list?.name}
                  </span>
                  <span className="individual-list-count">{list.tasks.length}</span>
                </div>
              ))}
              <span onClick={() => { setIsNewListClicked(!isNewListClicked) }}>
                <Icon path={mdiPlus} size={1} />
                Add New List
              </span>
              {isNewListClicked &&
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="list-name"
                    id="list-name"
                    placeholder="List Name"
                    onChange={(e) => setNewList(e.target.value)}
                    value={newList}
                  />
                  <button type="submit">Save List</button>
                </form>
              }
            </div>
          </section>
          <section className="sidebar-user-section">
            <h4>{session?.user?.name}</h4>
            <span onClick={() => signOut({ callbackUrl: 'http://localhost:3000/login' })}>
              <Icon path={mdiLogout} size={1} />
              <button>Sign out</button>
            </span>
          </section>
        </>
      }
    </nav>
  )
}