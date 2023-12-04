"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import { TaskLists } from "@/types/types";
import { format } from "date-fns";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

export type Task = {
  id: number | null;
  title: string;
  description: string;
  list?: number | null;
  dueDate?: string;
};

type Props = {
  isFormOpen: boolean;
  handleTaskForm: (isOpen: boolean) => void;
  lists: TaskLists[];
  isEdit: Task | null;
  setEditTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setIsNewTask: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewTaskForm({
  isFormOpen,
  handleTaskForm,
  lists,
  isEdit,
  setEditTask,
  setIsNewTask,
}: Props) {
  const { data: session } = useSession();
  const [task, setTask] = useState<Task>({
    id: isEdit?.id || null,
    title: isEdit?.title || "",
    description: isEdit?.description || "",
    list: isEdit?.list || null,
    dueDate: isEdit?.dueDate || "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = isEdit ? "/api/task/update" : "/api/task/new";
    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task,
          id: session?.user.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTask({
          id: null,
          title: "",
          description: "",
          dueDate: "",
          list: null,
        });
        if (isEdit) {
          enqueueSnackbar("Task successfully edited", { variant: "success" });
          setEditTask(null);
        } else {
          enqueueSnackbar("Task successfully created", { variant: "success" });
        }
        setIsNewTask(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isFormOpen && (
        <form className="new-task-form" onSubmit={handleSubmit}>
          <div className="new-task-top">
            <h2>
              {isEdit ? "Edit Task:" : "New Task"}
              <span
                onClick={() => {
                  handleTaskForm(false);
                  setEditTask(null);
                }}
              >
                <Icon path={mdiClose} size={1} />
              </span>
            </h2>
            <input
              type="text"
              name="task-title"
              id="task-title"
              placeholder="Title"
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              value={task?.title}
              required
            />
            <textarea
              name="task-description"
              id="task-description"
              placeholder="Description"
              rows={7}
              onChange={(e) =>
                setTask({ ...task, description: e.target.value })
              }
              value={task?.description}
            />
            <div className="new-task-info">
              <label>List:</label>
              <select
                onChange={(e) =>
                  setTask({ ...task, list: parseInt(e.target.value) })
                }
                defaultValue={task?.list || ""}
                required
              >
                {lists.map((list) => (
                  <option key={list?.id} value={list?.id}>
                    {list?.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="new-task-info">
              <label>Due date:</label>
              <input
                type="date"
                onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                value={
                  task?.dueDate
                    ? format(new Date(task?.dueDate), "yyyy-MM-dd")
                    : ""
                }
                required
              />
            </div>
            <SnackbarProvider />
          </div>
          {lists.length ? (
            <button>Save task</button>
          ) : (
            <>
              <button disabled>Save task</button>
            </>
          )}
        </form>
      )}
    </>
  );
}
