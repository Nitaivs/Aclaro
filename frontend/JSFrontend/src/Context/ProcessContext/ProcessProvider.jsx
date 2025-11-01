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
  }, [initialized]);

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

  async function addProcess(name, description) {
    try {
      console.log("Adding process to DB");
      const response = await axios.post(`${BASE_URL}processes`, {
        processName: name,
        processDescription: description
      });
      const newProcess = response.data;
      console.log("Process added to DB:", newProcess);
      newProcess.taskIds = [];
      setProcesses([...processes, newProcess]);
      console.log("Process added locally:", newProcess);
    } catch (error) {
      console.error("Error adding process to DB:", error);
    }
  }

  async function deleteProcess(processId) {
    try {
      console.log("Deleting process from DB");
      await axios.delete(`${BASE_URL}processes/${processId}`);
      console.log("Process deleted from DB:", processId);
    } catch (error) {
      console.error("Error deleting process from DB:", error);
    }
    setProcesses(processes.filter(process => process.processId !== processId));
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
