import Sidebar from "@/components/Sidebar";
import styles from "./dashboard.module.css"
import NewTaskForm from "@/components/NewTaskForm";

export default function Dashboard() {
  return (
    <main className={styles["main-container"]}>
      <Sidebar />
      <div className="middle"></div>
      <NewTaskForm />
    </main>
  )
}