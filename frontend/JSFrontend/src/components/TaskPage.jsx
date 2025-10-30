import {useParams} from "react-router";
import {Link} from "react-router";

/**
 * @component TaskPage
 * @description A page component that displays details for a specific task within a process.
 * Retrieves the processId and taskId from the URL parameters and provides navigation back to the associated process page.
 * @returns {JSX.Element} The rendered TaskPage component.
 */
export default function TaskPage() {
    const {processId, taskId} = useParams();

    return (
        <div>
            <h1>task {taskId}</h1>
            <p>This is the task page.</p>
            <p>This is a description</p>
            <Link to={`/process/${processId}`}>
                <button>
                    Go back to process {processId}
                </button>
            </Link>
        </div>
    )
}
