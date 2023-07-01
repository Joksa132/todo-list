

export default function NewTaskForm() {

  return (
    <form className="new-task-form">
      <div className="new-task-top">
        <h2>New Task:</h2>
        <input type="text" name="task-title" id="task-title" placeholder="Title" />
        <textarea name="task-description" id="task-description" placeholder="Description" rows={7} />
        <div className="new-task-info">
          <label>List:</label>
          <select>

          </select>
        </div>
        <div className="new-task-info">
          <label>Due date:</label>
          <input type="date" />
        </div>
      </div>
      <button>Save task</button>
    </form>
  )
}