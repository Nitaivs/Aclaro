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
      // const response = await axios.get(`${BASE_URL}departments`);
      // console.log(response);
      //TODO: remove mock response once backend is ready
      const response = {data: [{name: "HR", id: 1}, {name: "Engineering", id: 2}]}
      console.log("Departments:", response.data)
      setDepartments(response.data);
    }
    catch (error) {
      console.error("Error fetching departments from DB:", error);
    }
  }

  /**
   * @function addDepartment
   * @description Adds a new department to the database and updates the state.
   * @param name - The name of the department to add.
   * @returns {Promise<void>} A promise that resolves when the department is added and state is updated.
   */
  async function addDepartment(name) {
    try {
      console.log(`Adding department with name ${name} to DB`);
      // const response = await axios.post(`${BASE_URL}departments`, {name});
      //TODO: remove mock response once backend is ready
      const response = {data: [{name: name, id: Math.floor(Math.random() * 10000) }]}
      console.log(response);
      setDepartments([...departments, response.data]);
    } catch (error) {
      console.error(`Error adding department with name ${name} to DB:`, error);
      throw error;
    }
  }

  /**
   * @function deleteDepartmentById
   * @description Deletes a department by its ID from the database and updates the state.
   * @param {number} id - The ID of the department to delete.
   * @returns {Promise<void>} A promise that resolves when the department is deleted and state is updated.
   */
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
      addDepartment,
      deleteDepartmentById
    }}>
      {children}
    </DepartmentContext.Provider>
  )
}
