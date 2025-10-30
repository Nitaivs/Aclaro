import Card from '@mui/material/Card';
import {Link} from 'react-router';

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
export default function TaskCard(props) {
    return (
        <div>
            <Link to={`/process/${props.processId}/task/${props.taskId}`}>
                <Card>
                    <h2>{props.taskName}</h2>
                    <p>This is a description of the task.</p>
                </Card>
            </Link>
        </div>
    );
}
