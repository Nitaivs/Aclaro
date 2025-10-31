import Card from '@mui/material/Card';
import { Link } from 'react-router';
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
  const {processes} = use(ProcessContext);
  useEffect(() => {
    console.log("Processes updated:", processes);
  })
    return (
        <div>
            <Link to={`/process/${props.id}`}>
                <Card>
                    <h2>{props.processName}</h2>
                    <p>{processes.find(p => p.id === props.id)?.description || "No description"}</p>
                </Card>
            </Link>
        </div>
    );
}
