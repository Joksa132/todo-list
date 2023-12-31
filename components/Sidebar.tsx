"use client";

import { signOut, useSession } from "next-auth/react";
import Icon from "@mdi/react";
import {
  mdiCalendarMonth,
  mdiCalendarArrowRight,
  mdiCalendarCheck,
  mdiLogout,
  mdiPlus,
  mdiListBoxOutline,
  mdiMenu,
  mdiTextBoxRemoveOutline,
} from "@mdi/js";
import { useState } from "react";
import { TaskLists } from "@/types/types";
import { enqueueSnackbar } from "notistack";

type Props = {
  handleSidebarClick: (option: string | number) => void;
  taskLists: TaskLists[];
  setTaskLists: React.Dispatch<React.SetStateAction<TaskLists[]>>;
  handleSearch: (value: string) => void;
};

export default function Sidebar({
  handleSidebarClick,
  taskLists,
  setTaskLists,
  handleSearch,
}: Props) {
  const { data: session } = useSession();
  const [isNewListClicked, setIsNewListClicked] = useState(false);
  const [newList, setNewList] = useState("");
  const [isToggled, setIsToggled] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await fetch("/api/list/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newList,
          email: session?.user?.email,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTaskLists((prevLists: TaskLists[]) => [...prevLists, data.newList]);
        setNewList("");
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteList = async (list: TaskLists) => {
    try {
      const confirmDelete = confirm(
        "This will also delete all tasks in this list. Are you sure you want to delete this list?"
      );
      if (confirmDelete) {
        const res = await fetch(`/api/list/delete/${list.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (data.success) {
          enqueueSnackbar("List successfully deleted", { variant: "success" });
          handleSidebarClick("today");
          setTaskLists(
            taskLists.filter((taskList) => {
              return taskList.id !== list.id;
            })
          );
        }
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch(searchValue);
  };

  return (
    <nav className={isToggled ? "nav-toggled" : ""}>
      {isToggled ? (
        <div
          className="menu-icon"
          onClick={() => setIsToggled((prevState) => !prevState)}
        >
          <Icon path={mdiMenu} size={1.2} style={{ cursor: "pointer" }} />
        </div>
      ) : (
        <>
          <section className="sidebar-task-section">
            <div className="search-bar">
              <h2>
                Menu
                <span onClick={() => setIsToggled((prevState) => !prevState)}>
                  <Icon path={mdiMenu} size={1} />
                </span>
              </h2>
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  name="search-tasks"
                  id="search-tasks"
                  placeholder="Search"
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </form>
            </div>
            <div className="tasks-container">
              <h4>Tasks</h4>
              <span onClick={() => handleSidebarClick("today")}>
                <Icon path={mdiCalendarCheck} size={1} />
                Today
              </span>
              <span onClick={() => handleSidebarClick("upcoming")}>
                <Icon path={mdiCalendarArrowRight} size={1} />
                Upcoming
              </span>
            </div>
            <div className="lists-container">
              <h4>Lists</h4>
              {taskLists.map((list) => (
                <div
                  className="individual-list"
                  key={list?.id}
                  onClick={() => handleSidebarClick(list.id)}
                >
                  <span>
                    <Icon path={mdiListBoxOutline} size={1} />
                    {list?.name}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      className="remove-list-icon"
                      onClick={() => handleDeleteList(list)}
                    >
                      <Icon path={mdiTextBoxRemoveOutline} size={0.8} />
                    </span>
                    {list?.tasks && (
                      <span className="individual-list-count">
                        {list?.tasks.length}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <span
                onClick={() => {
                  setIsNewListClicked(!isNewListClicked);
                }}
              >
                <Icon path={mdiPlus} size={1} />
                Add New List
              </span>
              {isNewListClicked && (
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="list-name"
                    id="list-name"
                    placeholder="List Name"
                    onChange={(e) => setNewList(e.target.value)}
                    value={newList}
                  />
                  <button type="submit">Save</button>
                </form>
              )}
            </div>
          </section>
          <section className="sidebar-user-section">
            <h4>{session?.user?.name}</h4>
            <span onClick={() => signOut({ callbackUrl: "/login" })}>
              <Icon path={mdiLogout} size={1} />
              <button>Sign out</button>
            </span>
          </section>
        </>
      )}
    </nav>
  );
}
