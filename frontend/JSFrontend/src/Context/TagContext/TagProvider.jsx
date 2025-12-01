import {useEffect, useState} from "react";
import {TagContext} from "./TagContext.jsx";
import axios from "axios";
import {toast} from "react-toastify";

/**
 * @Component EmployeeProvider
 * @description Provides department-related state and functions to its children via DepartmentContext.
 * @param children The child components that will have access to the department context.
 * @returns {JSX.Element} The EmployeeProvider component.
 * @constructor
 */
export function TagProvider({children}) {
  const [departments, setDepartments] = useState([]);
  const [skills, setSkills] = useState([]);

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
    } catch (error) {
      console.error("Error fetching departments from DB:", error);
      throw error;
    }
  }

  /**
   * @function fetchAllSkills
   * @description Fetches all skills from the database and updates the state.
   * @returns {Promise<void>} A promise that resolves when the skills are fetched and state is updated.
   */
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
    } catch (error) {
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
      const response = await axios.post(`${BASE_URL}departments`, {name});
      console.log(response);
      setDepartments([...departments, response.data]);
    } catch (error) {
      console.error(`Error adding department with name ${name} to DB:`, error);
      if (error.response && error.response.status === 409) {
        throw new Error("Department with this name already exists.");
      }
        throw new error("Failed to add department. Backend failure");
    }
  }

  async function deleteTagById(id, type) {
    try {
      console.log(`Deleting tag with id ${id} from DB`);
      if (type === "department") {
        await deleteDepartmentById(id);
      } else if (type === "skill") {
        await deleteSkillById(id);
      }
    } catch (error) {
      console.error(`Error deleting tag with id ${id} from DB:`, error);
      if (error.response && error.response.status === 409) {
        throw new Error("Cannot delete tag: it is associated with existing employees or tasks.");
        } else if (error.response && error.response.status === 404) {
        throw new Error("Tag not found.");
        }
        throw new Error("Failed to delete tag. Backend failure");
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
      if (error.response && error.response.status === 409) {
        throw new Error("Cannot delete department: it is associated with existing employees.");
      }
      throw new Error("Failed to delete department. Backend failure");
    }
  }

  /**
   * @function deleteSkillById
   * @description Deletes a skill by its ID from the database and updates the state.
   * @param {number} id - The ID of the skill to delete.
   * @returns {Promise<void>} A promise that resolves when the skill is deleted and state is updated.
   */
  async function deleteSkillById(id) {
    try {
      console.log(`Deleting skill with id ${id} from DB`);
      const response = await axios.delete(`${BASE_URL}skills/${id}`);
      console.log(response);
      setSkills(skills.filter(skill => skill.id !== id));
    } catch (error) {
      console.error(`Error deleting skill with id ${id} from DB:`, error);
      if (error.response && error.response.status === 409) {
        throw new Error("Cannot delete skill: it is associated with existing employees or tasks.");
      } else if (error.response && error.response.status === 404) {
        throw new Error("Skill not found.");
      }
        throw new Error("Failed to delete skill.");
    }
  }

  /**
   * @function addSkill
   * @description Adds a new skill to the database and updates the state.
   * @param name - The name of the skill to add.
   * @returns {Promise<void>} A promise that resolves when the skill is added and state is updated.
   */
  async function addSkill(name) {
    try {
      console.log(`Adding skill with name ${name} to DB`);
      const response = await axios.post(`${BASE_URL}skills`, {name});
      console.log(response);
      setSkills([...skills, response.data]);
    } catch (error) {
      console.error(`Error adding skill with name ${name} to DB:`, error);
        if (error.response && error.response.status === 409) {
        throw new Error("Skill with this name already exists.");
        }
        throw new Error("Failed to add skill.");
    }
  }

  /**
   * @function updateTag
   * @description Handles updating a tag (skill or department) based on its type.
   * @param {number} id - The ID of the skill to update.
   * @param {string} type - The type of the tag (should be "skill" for this function).
   * @param {string} newName - The new name of the skill.
   * @returns {Promise<void>} A promise that resolves when the skill is updated and state is updated.
   */
  async function updateTag(id, type, newName) {
    try {
      console.log(`Updating skill with id ${id} on DB`, newName);
      if (type === "skill") {
        await updateSkill(id, newName);
      } else if (type === "department") {
        await updateDepartment(id, newName);
      }
    } catch (error) {
      console.error(`Error updating skill with id ${id} on DB:`, error);
      if (error.response && error.response.status === 404) {
        toast.error("Tag not found.");
      } else if (error.response && error.response.status === 409) {
        toast.error("Tag with this name already exists.");
      } else {
        toast.error("Failed to update tag.");
      }
    }
  }

  /**
   * @function updateDepartment
   * @description Updates a department's name in the database and updates the state.
   * @param id - The ID of the department to update.
   * @param newName - The new name of the department.
   * @param toast - Toast notification instance for displaying messages.
   * @returns {Promise<void>} A promise that resolves when the department is updated and state is updated.
   */
  async function updateDepartment(id, newName) {
    try {
      console.log(`Updating department with id ${id} on DB`, newName);
      const response = await axios.put(`${BASE_URL}departments/${id}`, newName);
      const updatedDepartment = response.data;
      console.log(response.data);
      setDepartments(prev =>
        prev.some(d => d.id === id)
          ? prev.map(d => (d.id === id ? updatedDepartment : d))
          : [...prev, updatedDepartment]
      );
    } catch (error) {
      console.error(`Error updating department with id ${id} on DB:`, error);
        if (error.response && error.response.status === 404) {
        toast.error("Department not found.");
        } else if (error.response && error.response.status === 409) {
        toast.error("Department with this name already exists.");
        } else {
        toast.error("Failed to update department.");
        }
    }
  }

  /**
   * @function updateSkill
   * @description Updates a skill's name in the database and updates the state.
   * @param id - The ID of the skill to update.
   * @param newName - The new name of the skill.
   * @param toast - Toast notification instance for displaying messages.
   * @returns {Promise<void>} A promise that resolves when the skill is updated and state is updated.
   */
  async function updateSkill(id, newName) {
    try {
      console.log(`Updating skill with id ${id} on DB`, newName);
      const response = await axios.put(`${BASE_URL}skills/${id}`, newName);
      const updatedSkill = response.data;
      console.log(response.data);
      setSkills(prev =>
        prev.some(s => s.id === id)
          ? prev.map(s => (s.id === id ? updatedSkill : s))
          : [...prev, updatedSkill]
      );
    } catch (error) {
       if (error.response && error.response.status === 404) {
        toast.error("Skill not found.");
        } else if (error.response && error.response.status === 409) {
        toast.error("Skill with this name already exists.");
        } else {
        toast.error("Failed to update skill.");
        }
    }
  }

  return (
    <TagContext.Provider value={{
      departments,
      skills,
      initializeTagsFromDB,
      fetchAllDepartments,
      fetchAllSkills,
      updateTag,
      addDepartment,
      addSkill,
      deleteTagById
    }}>
      {children}
    </TagContext.Provider>
  )
}
