import { useState, useEffect } from "react";
import { TaskContext } from "./TaskContext.jsx";
import axios from "axios";

export function EmployeeProvider({ children }) {
    const BASE_URL = "http://localhost:8080/api/";
    const [employees, setEmployees] = useState([]);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!initialized) {
            console.log("initializing employees");
            initializeProcessesFromDB();
        } else {
            console.log("Employees already initialized");
        }
    }, [initialized]);

    async function initializeEmployeesFromDB() {
        try {
            console.log("Initializing processes from DB");
            await fetchAllEmployees()
            setInitialized(true);
        } catch (error) {
            console.error("Error fetching employees from DB:", error);
        }
    }

    async function fetchAllEmployees() {
        try {
            console.log("Fetching all processes from DB");
            const response = await axios.get(`${BASE_URL}employees`);
            console.log(response);
            setProcesses(response.data);
        } catch (error) {
            console.error("Error fetching processes from DB:", error);
        }
    }

    async function fetchEmployeeById(employeeId) {
        try {
            console.log("Fetching process by ID from DB:", employeeId);
            const response = await axios.get(`${BASE_URL}employee/${employeeId}`);
            console.log("Fetched process:", response.data);
            const existingProcess = processes.find(p => p.employeeId === employeeId);
            if (existingProcess) {
                setProcesses(processes.map(p => p.employeeId === employeeId ? response.data : p));
                return;
            }
            setProcesses([...processes, response.data]);
        } catch (error) {
            console.error("Error fetching process by ID from DB:", error);
        }
    }
}