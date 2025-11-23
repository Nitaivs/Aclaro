import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";
import {use} from "react";
import TaskCard from "./TaskCard.jsx";

export default function TaskListPage() {
  const {tasks} = use(TaskContext);

  return (
    <div>
      <h1>Tasks</h1>
      <ul>
        {tasks.map((task) => {
          return (
            <li key={task.id}>
              <TaskCard
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
  )
}
