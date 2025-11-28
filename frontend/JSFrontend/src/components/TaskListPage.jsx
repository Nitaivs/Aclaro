import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";
import {use} from "react";
import TaskItem from "./TaskItem.jsx";
import '../style/DetailPanel.css'

export default function TaskListPage() {
  const {tasks} = use(TaskContext);

  return (
    <>
      <div className={"detail-container"}>
        <div className={"detail-header"}>
          <h2>Tasks</h2>
        </div>
        <ul>
          {tasks.map((task) => {
            return (
              <li key={task.id}>
                <TaskItem
                  processId={task.processId}
                  taskId={task.id}
                  taskName={task.name}
                  taskDescription={task.description}
                />
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
