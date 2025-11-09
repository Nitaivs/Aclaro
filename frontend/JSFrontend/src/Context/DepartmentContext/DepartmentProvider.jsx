import {useEffect, useState} from "react";
import {DepartmentContext} from "./DepartmentContext.jsx";
import axios from "axios";

/**
 * @Component EmployeeProvider
 * @description Provides department-related state and functions to its children via DepartmentContext.
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function EmployeeProvider({children}) {
  const [departments, setDepartments] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const BASE_URL = "http://localhost:8080/api/";
  //TODO: move BASE_URL to config file

  //TODO: initialize departments from DB
  // useEffect(() => {})

  async function initializeDepartmentsFromDB() {
    try {
      console.log("Initializing departments from DB");
      await fetchAllDepartments();
      setInitialized(true);
    }
    catch (error) {
      console.error("Error fetching departments from DB:", error);
    }
  }

  async function fetchAllDepartments() {
    try {
      console.log("Fetching all departments from DB");
      const response = await axios.get(`${BASE_URL}departments`);
      console.log(response);
      setDepartments(response.data);
    }
    catch (error) {
      console.error("Error fetching departments from DB:", error);
    }
  }

  async function deleteDepartmentById(id) {
    try {
      console.log(`Deleting department with id ${id} from DB`);
      const response = await axios.delete(`${BASE_URL}departments/${id}`);
      console.log(response);
      setDepartments(departments.filter(department => department.id !== id));
    } catch (error) {
      console.error(`Error deleting department with id ${id} from DB:`, error);
    }
  }

  return (
    <DepartmentContext.Provider value={{
      departments,
      initializeDepartmentsFromDB,
      fetchAllDepartments,
      deleteDepartmentById
    }}>
      {children}
    </DepartmentContext.Provider>
  )
}
