import {useState} from "react";
import {ProcessContext} from "./ProcessContext.jsx";

export function ProcessProvider({children}) {
  const [processes, setProcesses] = useState([]);

  function addProcess() {
    //TODO: rewrite to get ID from database after integration
    const process = {
      id: processes.length + 1,
      name: `Process ${processes.length + 1}`,
      description: 'This is a new process',
      tasks: []
    }
    setProcesses([...processes, process]);
  }

  function deleteProcess(processId) {
    setProcesses(processes.filter(process => process.id !== processId));
  }

  function editDescription(processId, newDescription) {
    setProcesses(processes.map(process =>
      process.id === processId ? {...process, description: newDescription} : process
    ));
  }

  return (
    <ProcessContext value={{processes, addProcess, deleteProcess, editDescription}}>
      {children}
    </ProcessContext>
  )
}
