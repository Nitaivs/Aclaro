import {useState} from "react";
import ProcessCard from "./ProcessCard.tsx";

/**
 * @component ProcessesContainer
 * @description A container component that manages and displays a list of processes.
 * Users can add new processes and each process is represented by a ProcessCard component.
 *
 * @return {JSX.Element} The rendered ProcessesContainer component.
 */
export default function ProcessesContainer() {
    const [processes, setProcesses] = useState<{ id: number; name: string }[]>([])

    function addProcess() {
        const newProcess = {
            id: processes.length + 1,
            name: `Process ${processes.length + 1}`
        }
        setProcesses([...processes, newProcess])
    }

    return (
        <div>
            <h1>ProSeed</h1>
            <button onClick={addProcess}>Add process</button>
            <ul>
                {processes.map((process) => (
                    <li key={process.id}>
                        <ProcessCard id={process.id} processName={process.name}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}
