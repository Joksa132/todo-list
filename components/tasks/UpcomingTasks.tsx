"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import { isAfter, isTomorrow, isWithinInterval } from "date-fns";
import IndividualTask from "./Task";
import { Task } from "@/types/types";

type Props = {
  handleTaskForm: (isOpen: boolean) => void;
  handleEdit: (task: Task) => void;
  isNewTask: boolean;
  setIsNewTask: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UpcomingTasks({
  handleTaskForm,
  handleEdit,
  isNewTask,
  setIsNewTask,
}: Props) {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clickedTask, setClickedTask] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  if (isNewTask) {
    fetchTasks();
    setIsNewTask(false);
  }

  async function fetchTasks() {
    try {
      const res = await fetch(`/api/task/upcoming/${session?.user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (session) {
      fetchTasks();
    }
  }, [session]);

  const handleDelete = async (task: Task) => {
    try {
      const res = await fetch(`/api/task/delete/${task?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const getDate = (date: string | undefined) => {
    return date ? new Date(date) : new Date(2023, 0, 0);
  };

  function getTomorrowTasks(tasks: Task[]) {
    const tomorrowTasks = tasks.filter((task) => {
      const dueDate = getDate(task?.dueDate);
      return isTomorrow(dueDate);
    });
    return tomorrowTasks;
  }

  function getWeekTasks(tasks: Task[]) {
    const tomorrow = new Date();
    const nextWeek = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const weekTasks = tasks.filter((task) => {
      const dueDate = getDate(task?.dueDate);
      return isWithinInterval(dueDate, { start: tomorrow, end: nextWeek });
    });
    return weekTasks;
  }

  function getLaterTasks(tasks: Task[]) {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const laterTasks = tasks.filter((task) => {
      const dueDate = getDate(task?.dueDate);
      return isAfter(dueDate, nextWeek);
    });
    return laterTasks;
  }

  const tomorrowTasks = getTomorrowTasks(tasks);
  const weekTasks = getWeekTasks(tasks);
  const laterTasks = getLaterTasks(tasks);

  return (
    <div className="list-container">
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
          <div className="list-title">
            <h1>Upcoming</h1>
            <span>{tasks.length}</span>
          </div>
          <button
            className="new-task-button"
            onClick={() => handleTaskForm(true)}
          >
            <Icon path={mdiPlus} size={1} />
            Add New Task
          </button>
          <div className="upcoming-tasks">
            <div className="list-tasks">
              <h3>Tomorrow</h3>
              {tomorrowTasks.length ? (
                tomorrowTasks?.map((task) => (
                  <IndividualTask
                    task={task}
                    clickedTask={clickedTask}
                    setClickedTask={setClickedTask}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    key={task?.id}
                  />
                ))
              ) : (
                <span
                  style={{
                    marginTop: "10px",
                    fontSize: "1.1rem",
                    paddingLeft: "12px",
                  }}
                >
                  No tasks for tomorrow
                </span>
              )}
            </div>
            <div className="list-tasks-bottom">
              <div className="this-week-tasks">
                <h3>This Week</h3>
                {weekTasks.length ? (
                  weekTasks?.map((task) => (
                    <IndividualTask
                      task={task}
                      clickedTask={clickedTask}
                      setClickedTask={setClickedTask}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                      key={task?.id}
                    />
                  ))
                ) : (
                  <span
                    style={{
                      marginTop: "10px",
                      fontSize: "1.1rem",
                      paddingLeft: "12px",
                    }}
                  >
                    No tasks for this week not counting tomorrow
                  </span>
                )}
              </div>
              <div className="later-tasks">
                <h3>Later Tasks</h3>
                {laterTasks.length ? (
                  laterTasks?.map((task) => (
                    <IndividualTask
                      task={task}
                      clickedTask={clickedTask}
                      setClickedTask={setClickedTask}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                      key={task?.id}
                    />
                  ))
                ) : (
                  <span
                    style={{
                      marginTop: "10px",
                      fontSize: "1.1rem",
                      paddingLeft: "12px",
                    }}
                  >
                    No tasks later than this week
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
