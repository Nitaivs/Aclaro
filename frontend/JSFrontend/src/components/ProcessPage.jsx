import {Link} from 'react-router';
import {useParams} from "react-router";
import {use} from "react";
import TaskCard from "./TaskCard.jsx";
import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";

/**
 * @component ProcessPage
 * @description A page component that displays details for a specific process.
 * Retrieves the processId from the URL parameters and provides navigation back to the dashboard.
 * Allows adding tasks to the process and displays them using TaskCard components.
 * Displays an error message if the processId is invalid.
 * @returns {JSX.Element} The rendered ProcessPage component.
 */
export default function ProcessPage() {
  const {processId} = useParams();
  const parsedProcessId = processId ? parseInt(processId) : undefined;
  const {tasks, addTask, deleteTask} = use(TaskContext);

  if (!parsedProcessId) {
    return (
      <div>
        <p>Invalid process ID</p>
        <p>{parsedProcessId}</p>
        <Link to="/">
          <button>
            Go to Dashboard
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/">
        <button>
          Go to Dashboard
        </button>
      </Link>
      <h1>Process Page</h1>
      <p>Process ID: {processId}</p>
      <button onClick={() => addTask()}>
        Add Task
      </button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskCard processId={parsedProcessId} taskId={task.id} taskName={task.name}/>
            <button onClick={() => deleteTask(task.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
