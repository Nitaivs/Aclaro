import {useEffect, useState} from "react";
import {EmployeeContext} from "./EmployeeContext.jsx";
import axios from "axios";

/**
 * @Component EmployeeProvider
 * @description Provides employee-related state and functions to its children via EmployeeContext.
 * @param children The child components that will have access to the employee context.
 * @returns {JSX.Element} The EmployeeProvider component.
 */
export function EmployeeProvider({children}) {
  const [employees, setEmployees] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const BASE_URL = "http://localhost:8080/api/";
  //TODO: move BASE_URL to config file

  /**
   * Effect hook that initializes employees from the database when the component mounts.
   */
  useEffect(() => {
    if (!initialized) {
      initializeEmployeesFromDB();
    }
  }, [initialized])

  /**
   * @function initializeEmployeesFromDB
   * @description Initializes employees from the database.
   * Calls fetchAllEmployees to retrieve all employees and update the state, then sets initialized to true.
   * @returns {Promise<void>} A promise that resolves when the initialization is complete.
   */
  async function initializeEmployeesFromDB() {
    try {
      console.log("Initializing employees from DB");
      await fetchAllEmployees();
      setInitialized(true);
    } catch (error) {
      console.error("Error fetching employees from DB:", error);
    }
  }

  /**
   * @function fetchAllEmployees
   * @description Fetches all employees from the database and updates the state.
   * @returns {Promise<void>} A promise that resolves when the employees are fetched and state is updated.
   */
  async function fetchAllEmployees() {
    try {
      console.log("Fetching all employees from DB");
      //TODO: replace mock response once backend is ready
      const response = {
        data: [
          {
            firstName: "John", lastName: "Doe", id: 1
          },
          {
            firstName: "Jane", lastName: "Doe", id: 2
          }]
      }
      //TODO: update endpoint if needed
      // const response = await axios.get(`${BASE_URL}employees`);
      console.log("Employees:", response.data)
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees from DB:", error);
    }
  }

  /**
   * @function fetchEmployeeById
   * @description Fetches an employee by their ID from the database.
   * Fetches the employee, checks if they already exist in state, and updates or adds them accordingly.
   * @param id - The ID of the employee to fetch.
   * @returns {Promise<void>} A promise that resolves when the employee is fetched and state is updated.
   */
  async function fetchEmployeeById(id) {
    try {
      console.log(`Fetching employee with id ${id} from DB`);
      const response = await axios.get(`${BASE_URL}employees/${id}`);
      console.log(response);
      // Check if employee with the given ID already exists in state
      const existingEmployee = employees.find(employee => employee.id === id);
      if (existingEmployee) {
        // Update existing employee
        setEmployees(employees.map(employee => employee.id === id ? response.data : employee));
        return;
      }
      // Add new employee to state
      setEmployees([...employees, response.data]);
    } catch (error) {
      console.error(`Error fetching employee with id ${id} from DB:`, error);
    }
  }

  //TODO: implement adding departments to employees
  function updateEmployee(id, updatedFields) {
    //TODO: implement update request to backend when backend is ready
    setEmployees(employees.map(employee =>
      employee.id === id ? {...employee, ...updatedFields} : employee
    ));
  }

  /**
   * @function deleteEmployeeById Deletes an employee by their ID from the database.
   * Sends a delete request and updates the state to remove the deleted employee.
   * @param id - The ID of the employee to delete.
   * @returns {Promise<void>} A promise that resolves when the employee is deleted and state is updated.
   */
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

  /**
   * @function addEmployee
   * @description Adds a new employee to the database.
   * Sends a post request and updates the state to include the new employee.
   * @param firstName - The first name of the employee to add.
   * @param lastName - The last name of the employee to add.
   * @returns {Promise<void>} A promise that resolves when the employee is added and state is updated.
   */
async function addEmployee(firstName, lastName) {
    try {
        console.log(`Adding employee ${firstName} ${lastName} to DB`);
        const response = await axios.post(`${BASE_URL}employees`, { firstName, lastName });
        console.log("Added employee:", response.data);
        setEmployees(prev => [...prev, response.data]);
        return response.data;
    } catch (error) {
        console.error(`Error adding employee ${firstName} ${lastName} to DB:`, error);
        throw error;
    }
}

  return (
    <EmployeeContext.Provider value={{
      employees,
      fetchAllEmployees,
      fetchEmployeeById,
      addEmployee,
      updateEmployee,
      deleteEmployeeById,
      initializeEmployeesFromDB,
      initialized
    }}>
      {children}
    </EmployeeContext.Provider>
  )
}
