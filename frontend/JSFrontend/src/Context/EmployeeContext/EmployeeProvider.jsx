import {useEffect, useState} from "react";
import {EmployeeContext} from "./EmployeeContext.jsx";
import axios from "axios";

export function EmployeeProvider({children}) {
  const [employees, setEmployees] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const BASE_URL = "http://localhost:8080/api/";
  //TODO: move BASE_URL to config file

  useEffect(() => {
    if (!initialized) {
      initializeEmployeesFromDB();
    }
  })

  async function initializeEmployeesFromDB() {
    try {
      console.log("Initializing employees from DB");
      await fetchAllEmployees();
      setInitialized(true);
    } catch (error) {
      console.error("Error fetching employees from DB:", error);
    }
  }

  async function fetchAllEmployees() {
    try {
      console.log("Fetching all employees from DB");
      //TODO: replace mock response once backend is ready
      const response = {data: [{name: "John Doe", id: 1}, {name: "Jane Doe", id: 1}]}
      //TODO: update endpoint if needed
      // const response = await axios.get(`${BASE_URL}employees`);
      console.log(response);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees from DB:", error);
    }
  }

  async function fetchEmployeeById(id) {
    try {
      console.log(`Fetching employee with id ${id} from DB`);
      const response = await axios.get(`${BASE_URL}employees/${id}`);
      console.log(response);
      return response.data;
    }
    catch (error) {
      console.error(`Error fetching employee with id ${id} from DB:`, error);
    }
  }

  //TODO: add update method once backend supports it

  async function deleteEmployeeById(id) {
    try {
      console.log(`Deleting employee with id ${id} from DB`);
      const response = await axios.delete(`${BASE_URL}employees/${id}`);
      console.log(response);
      setEmployees(employees.filter(employee => employee.id !== id));
    } catch (error) {
      console.error(`Error deleting employee with id ${id} from DB:`, error);
    }
  }

  return (
    <EmployeeContext.Provider value={{
      employees,
      fetchAllEmployees,
      fetchEmployeeById,
      deleteEmployeeById,
      initializeEmployeesFromDB,
      initialized
    }}>
      {children}
    </EmployeeContext.Provider>
  )
}
