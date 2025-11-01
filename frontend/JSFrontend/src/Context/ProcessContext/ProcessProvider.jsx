import {useState} from "react";
import {ProcessContext} from "./ProcessContext.jsx";

export function ProcessProvider({children}) {
  const [processes, setProcesses] = useState([]);

  function addProcess(name, description) {
    //TODO: rewrite to get ID from database after integration
    const process = {
      processId: processes.length + 1,
      processName: name || `Process ${processes.length + 1}`,
      processDescription: description || "",
      processTasks: []
    }
    setProcesses([...processes, process]);
  }

  function deleteProcess(processId) {
    setProcesses(processes.filter(process => process.id !== processId));
  }

  function editName(processId, newName) {
    setProcesses(processes.map(process =>
      process.id === processId ? {...process, name: newName} : process
    ));
  }

  function editDescription(processId, newDescription) {
    setProcesses(processes.map(process =>
      process.id === processId ? {...process, description: newDescription} : process
    ));
  }

  return (
    <ProcessContext value={{
      processes,
      addProcess,
      deleteProcess,
      editName,
      editDescription
    }}>
      {children}
    </ProcessContext>
  )
}
