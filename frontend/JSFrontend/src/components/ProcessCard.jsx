import Card from '@mui/material/Card';
import {Link} from 'react-router';
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import {use, useEffect} from "react";

/**
 * @component ProcessCard
 * @description A card component that displays information about a process.
 * The card serves as a link to the detailed process page.
 * @param props The properties for the ProcessCard component.
 * @param props.id The ID of the process.
 * @param props.processName The name of the process.
 * @returns {JSX.Element} The rendered ProcessCard component.
 */
export default function ProcessCard(props) {
  const {processes, deleteProcess} = use(ProcessContext);
  const foundProcess = processes.find(p => p.processId === props.id);
  useEffect(() => {
    console.log("Processes updated:", processes);
  }, [processes]);

  if (!foundProcess) {
    return (
      <div>
        <p>Process not found</p>
      </div>
    );
  } else {
    return (
      <div>
        <Card>
          <Link to={`/process/${props.id}`}>
            <h2>{foundProcess.processName}</h2>
            <p>{foundProcess.processDescription}</p>
          </Link>
          <button onClick={() => deleteProcess(foundProcess.processId)}>Delete</button>
        </Card>
      </div>
    );
  }
}
