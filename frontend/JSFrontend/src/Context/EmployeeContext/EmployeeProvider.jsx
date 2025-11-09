import { useState, useEffect } from "react";
import { TaskContext } from "./TaskContext.jsx";
import axios from "axios";

export function EmployeeProvider({ children }) {
    const BASE_URL = "http://localhost:8080/api/";
    const [employees, setEmployees] = useState([]);
    const [initialized, setInitialized] = useState(false);

}