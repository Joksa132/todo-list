"use client";

import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import IndividualTask from "./Task";
import { TaskLists } from "@/types/types";

type Task = {
  id: number | null;
  title: string;
  description: string;
  dueDate?: string;
  taskList?: TaskLists;
};

type Props = {
  handleTaskForm: (isOpen: boolean) => void;
  activeComponent: string | number;
  isNewTask: boolean;
  setIsNewTask: React.Dispatch<React.SetStateAction<boolean>>;
  handleEdit: (task: Task) => void;
};

export default function TaskList({
  handleTaskForm,
  handleEdit,
  activeComponent,
  isNewTask,
  setIsNewTask,
}: Props) {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [clickedTask, setClickedTask] = useState<number | null>(null);

  if (isNewTask) {
    fetchTasks();
    setIsNewTask(false);
  }

  async function fetchTasks() {
    try {
      const res = await fetch(`/api/task/${activeComponent}`, {
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
  }, [session, activeComponent]);

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

  return (
    <div className="list-container">
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
          <div className="list-title">
            <h1>{tasks[0]?.taskList?.name}</h1>
            <span>{tasks?.length}</span>
          </div>
          <button
            className="new-task-button"
            onClick={() => handleTaskForm(true)}
          >
            <Icon path={mdiPlus} size={1} />
            Add New Task
          </button>
          <div className="list-tasks">
            {tasks.map((task) => (
              <IndividualTask
                task={task}
                clickedTask={clickedTask}
                setClickedTask={setClickedTask}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                key={task?.id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
