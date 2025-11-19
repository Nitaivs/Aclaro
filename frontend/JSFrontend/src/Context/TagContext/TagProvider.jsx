import {useEffect, useState} from "react";
import {TagContext} from "./TagContext.jsx";
import axios from "axios";

/**
 * @Component EmployeeProvider
 * @description Provides department-related state and functions to its children via DepartmentContext.
 * @param children The child components that will have access to the department context.
 * @returns {JSX.Element} The EmployeeProvider component.
 * @constructor
 */
export function TagProvider({children}) {
  const [departments, setDepartments] = useState([]);
  const [Skills, setSkills] = useState([]);

  const [initialized, setInitialized] = useState(false);
  const BASE_URL = "http://localhost:8080/api/";
  //TODO: move BASE_URL to config file

  /**
   * useEffect hook that initializes departments from the database when the component mounts.
   */
  useEffect(() => {
    if (!initialized) {
      initializeTagsFromDB();
    }
  }, [initialized])

  /**
   * @function initializeDepartmentsFromDB
   * @description Initializes departments from the database.
   * Calls fetchAllDepartments to retrieve all departments and update the state, then sets initialized to true.
   * @returns {Promise<void>} A promise that resolves when the initialization is complete.
   */
  async function initializeTagsFromDB() {
    try {
      console.log("Initializing departments from DB");
      await fetchAllDepartments();
      await fetchAllSkills();
      setInitialized(true);
    }
    catch (error) {
      console.error("Error fetching departments from DB:", error);
      throw error;
    }
  }

  async function fetchAllSkills() {
    try {
      console.log("Fetching all skills from DB");
      const response = await axios.get(`${BASE_URL}skills`);
      console.log(`Skills:`, response.data)
      setSkills(response.data);
    } catch (error) {
      console.error("Error fetching skills from DB:", error);
      throw error;
    }
  }

  /**
   * @function fetchAllDepartments
   * @description Fetches all departments from the database and updates the state.
   * @returns {Promise<void>} A promise that resolves when the departments are fetched and state is updated.
   */
  async function fetchAllDepartments() {
    try {
      console.log("Fetching all departments from DB");
      const response = await axios.get(`${BASE_URL}departments`);
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
    <TagContext.Provider value={{
      departments,
      initializeTagsFromDB,
      fetchAllDepartments,
      addDepartment,
      deleteDepartmentById
    }}>
      {children}
    </TagContext.Provider>
  )
}
