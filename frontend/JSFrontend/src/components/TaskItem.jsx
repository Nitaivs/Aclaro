import Card from '@mui/material/Card';
import {useNavigate, useLocation} from 'react-router';
import '../style/ProcessItem.css'

/**
 * @component TaskCard
 * @description A card component that displays information about a task within a process.
 * The card serves as a link to the detailed task page.
 * @param props The properties for the TaskCard component.
 * @param {number} props.taskId The ID of the task.
 * @param {string} props.taskName The name of the task.
 * @param {string} props.taskDescription The description of the task.
 * @returns {JSX.Element} The rendered TaskCard component.
 */
export default function TaskItem({taskId, taskName, taskDescription}) {
  const navigate = useNavigate();
  const location = useLocation();

  function openTaskModal() {
    navigate(`/tasks/${taskId}`, {state: {background: location}});
  }

  return (
    <div>
      <div className={"process-item"}>
        <div className={"process-item-info"}>
          <h4 style={{color: 'red'}}>Task</h4>
          <span>|</span>
          <h4>{taskName}</h4>
        </div>
        {/*<div className={"process-item-info"}>*/}
          <p>{taskDescription}</p>
        {/*</div>*/}
      </div>
    </div>
  );
}
