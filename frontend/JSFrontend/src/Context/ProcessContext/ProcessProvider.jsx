import {useEffect, useState} from "react";
import {ProcessContext} from "./ProcessContext.jsx";
import axios from "axios";

export function ProcessProvider({children}) {
  const [processes, setProcesses] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const BASE_URL = "http://localhost:8080/api/";

  useEffect(() => {
    if (!initialized) {
      console.log("initializing processes");
      initializeProcessesFromDB();
    } else {
      console.log("Processes already initialized");
    }
  })

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

  async function initializeProcessesFromDB() {
    try {
      console.log("Initializing processes from DB");
      const response = await axios.get(`${BASE_URL}processes`);
      //TODO: rewrite once default process fetch includes tasks
      for (const process of response.data) {
        const tasksResponse = await axios.get(`${BASE_URL}processes/${process.processId}/tasks`);
        process.processIds = tasksResponse.data.taskIds;
      }
      setProcesses(response.data);
      setInitialized(true);
    } catch (error) {
      console.error("Error fetching processes from DB:", error);
    }
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
      editDescription,
      initializeProcessesFromDB
    }}>
      {children}
    </ProcessContext>
  )
}
