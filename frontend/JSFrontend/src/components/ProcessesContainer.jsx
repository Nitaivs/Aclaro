import ProcessCard from "./ProcessCard.jsx";
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import {use} from "react";

/**
 * @component ProcessesContainer
 * @description A container component that manages and displays a list of processes.
 * Users can add new processes and each process is represented by a ProcessCard component.
 *
 * @return {JSX.Element} The rendered ProcessesContainer component.
 */
export default function ProcessesContainer() {
  const {processes, addProcess, deleteProcess} = use(ProcessContext);

  return (
    <div>
      <h1>ProSeed</h1>
      <button onClick={addProcess}>Add process</button>
      <ul>
        {processes.map((process) => (
          <li key={process.id}>
            <ProcessCard id={process.id} processName={process.name}/>
            <button onClick={() => deleteProcess(process.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
