import {Avatar, ListItemAvatar, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {use, useState} from "react";
import {EmployeeContext} from "../Context/EmployeeContext/EmployeeContext.jsx";
import editIcon from "../assets/edit.svg";
import deleteIcon from "../assets/delete.svg";
import EditEmployeeDialog from "./EditEmployeeDialog.jsx";
import AreYouSureDialog from "./AreYouSureDialog.jsx";


export default function EmployeeItem({employeeId}) {
  const {employees} = use(EmployeeContext);
  const foundEmployee = employees.find(e => e.id === parseInt(employeeId));
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const {deleteEmployeeById, updateEmployee} = use(EmployeeContext);

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
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  }

  async function handleDeleteEmployee() {
    try {
      await deleteEmployeeById(foundEmployee.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  }

  if (!foundEmployee) {
    return (
      <div>
        <Typography variant="body1" component="div">
          Error: Employee with id: {employeeId} not found.
        </Typography>
      </div>
    );
  }

  return (
    <>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
        {/*<Link style={{textDecoration: 'none'}} to={`/employees/${foundEmployee.id}`}>*/}
          <div style={{display: 'flex', alignItems: 'center'}}>
            <ListItemAvatar>
              <Avatar/>
            </ListItemAvatar>
            <div>
              <Typography color="text.primary" variant="body1" component="div">
                {`${foundEmployee.firstName} ${foundEmployee.lastName}`}
              </Typography>
              <Typography variant="body2" color="text.secondary" component="div">
                <div>
                  Department: {foundEmployee.department?.name || "Unassigned"}
                  <br/>
                  Skills: {foundEmployee.skills?.length
                  ? foundEmployee.skills.map(skill => skill.name).join(", ") : "No skills assigned"}
                </div>
              </Typography>
            </div>
          </div>
        {/*</Link>*/}
        <div style={{display: 'flex', alignItems: 'center'}}>
          <IconButton
            edge="end"
            aria-label={`edit-employee-${foundEmployee.id}`}
            size="small"
            onClick={(e) => {
              {/* Prevent link navigation when clicking the button */}
              e.preventDefault();
              setIsEditDialogOpen(true)
            }}
          >
            <img src={editIcon} alt={"tag edit button"} height={30} width={30}/>
          </IconButton>
          <IconButton
            edge="end"
            aria-label={`delete-employee-${foundEmployee.id}`}
            size="small"
            style={{marginLeft: 'auto'}}
            onClick={(e) => {
              {/* Prevent link navigation when clicking the button */}
              e.preventDefault();
              setIsDeleteDialogOpen(true)
            }}
          >
            <img src={deleteIcon} alt={"tag delete button"} height={30} width={30}/>
          </IconButton>
        </div>
      </div>
      <EditEmployeeDialog
        currentFirstName={foundEmployee.firstName}
        currentLastName={foundEmployee.lastName}
        currentSkills={foundEmployee.skills}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleUpdateEmployee}
        currentDepartment={foundEmployee.department}
      />
      <AreYouSureDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title={"Delete Employee"}
        message={`Are you sure you want to delete the employee "${foundEmployee.firstName} ${foundEmployee.lastName}"? This action cannot be undone.`}
        onConfirm={handleDeleteEmployee}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </>
  )
}
