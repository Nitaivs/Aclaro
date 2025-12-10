import {Link} from "react-router";
import {use, useState} from 'react';
import {EmployeeContext} from "../Context/EmployeeContext/EmployeeContext.jsx";
import {useParams} from "react-router";
import EditEmployeeDialog from "./EditEmployeeDialog.jsx";

/**
 * @component EmployeePage
 * @description A page that displays the employee's details.
 * @returns {JSX.Element} The rendered EmployeePage component.
 */
export default function EmployeePage() {
  const {employees, updateEmployee} = use(EmployeeContext);
  const {employeeId} = useParams();
  const parsedEmployeeId = employeeId ? parseInt(employeeId) : undefined;
  const foundEmployee = employees.find(e => e.id === parseInt(employeeId));
  const [isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen] = useState(false);

  /**
   * @function handleUpdateEmployee
   * @description Handles the update of an employee's details.
   * Calls the updateEmployee function from EmployeeContext with the new details.
   * @param {String} newFirstName - The new first name for the employee.
   * @param {String} newLastName - The new last name for the employee.
   * @param {Object} newDepartment - The new department for the employee.
   * @param {Array<Object>} newSkills - The new skills for the employee.
   * @returns {Promise<void>} A promise that resolves when the employee is updated or an error occurs.
   */
    async function handleUpdateEmployee(newFirstName, newLastName, newDepartment, newSkills) {
        const requestForm = {
            firstName: newFirstName,
            lastName: newLastName,
            //Extract ID from department object, or send null if removed
            departmentId: newDepartment ? newDepartment.id : null,
            //Map array of skill objects to array of skill IDs
            skillIds: Array.isArray(newSkills) ? newSkills.map(s => s.id) : []
        };
        try {
            await updateEmployee(foundEmployee.id, requestForm);
            setIsEditEmployeeDialogOpen(false);
        } catch (error) {
            console.error("Failed to update employee:", error);
        }
    }

  if (!parsedEmployeeId) {
    return (
      <div>
        <h1>Employee Page</h1>
        <p>Error: Invalid employee ID.</p>
      </div>
    );
  }

  if (!foundEmployee) {
    return (
      <div>
        <h1>Employee Page</h1>
        <p>Error: Employee with id: {parsedEmployeeId} not found.</p>
      </div>
    );
  }

const skillsList = Array.isArray(foundEmployee.skills)
    ? foundEmployee.skills
            .map(s => (typeof s === 'string' ? s : s && s.name ? s.name : ''))
            .filter(Boolean)
            .join(', ')
    : (foundEmployee.skills || '');

return (
    <div>
        <h2>Employee Page</h2>
        <h1>{foundEmployee.firstName} {foundEmployee.lastName}</h1>
        <p>Department: {foundEmployee.department?.name || "None"}</p>
        <p>Skills: {skillsList || "None"}</p>
        <button onClick={() => setIsEditEmployeeDialogOpen(true)}>
            Edit Employee
        </button>
        <EditEmployeeDialog
            currentFirstName={foundEmployee.firstName}
            currentLastName={foundEmployee.lastName}
            currentSkills={foundEmployee.skills}
            isOpen={isEditEmployeeDialogOpen}
            onClose={() => setIsEditEmployeeDialogOpen(false)}
            onSave={handleUpdateEmployee}
            currentDepartment={foundEmployee.department}
        />
    </div>
);
}
