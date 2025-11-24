import Card from '@mui/material/Card';
import {useNavigate, useLocation} from 'react-router';

/**
 * @component TaskCard
 * @description A card component that displays information about a task within a process.
 * The card serves as a link to the detailed task page.
 * @param props The properties for the TaskCard component.
 * @param props.processId The ID of the process to which the task belongs.
 * @param props.taskId The ID of the task.
 * @param props.taskName The name of the task.
 * @returns {JSX.Element} The rendered TaskCard component.
 */
export default function TaskCard({ taskId, taskName, taskDescription}) {
  const navigate = useNavigate();
  const location = useLocation();

  function openTaskModal() {
    navigate(`/tasks/${taskId}`, {state: {background: location}});
  }

  return (
    <div>
      <Card
        onClick={openTaskModal}
        role="button"
        style={{cursor: 'pointer'}}
      >
          <h2>{taskName}</h2>
          <p>{taskDescription}</p>
      </Card>
    </div>
  );
}
