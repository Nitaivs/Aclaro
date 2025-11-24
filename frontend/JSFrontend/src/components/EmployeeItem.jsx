import {Avatar, ListItemAvatar, ListItemText} from "@mui/material";
import {use} from "react";
import {EmployeeContext} from "../Context/EmployeeContext/EmployeeContext.jsx";

export default function EmployeeItem({employeeId}) {
  const {employees} = use(EmployeeContext);
  const foundEmployee = employees.find(e => e.id === parseInt(employeeId));
  return (
    <div>
      <ListItemAvatar>
        <Avatar/>
      </ListItemAvatar>
      <ListItemText
        primary={`${foundEmployee.firstName} ${foundEmployee.lastName}`}
        secondary={
          <>
            <span>Department: {foundEmployee.department?.name || "Unassigned"}</span>
            <br/>
            <span>Skills: {foundEmployee.skills?.length
              ? foundEmployee.skills.map(skill => skill.name).join(", ") : "No skills assigned"}</span>
          </>
        }
      />
    </div>
  )
}
