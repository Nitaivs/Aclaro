import {use, useState} from "react";
import {EmployeeContext} from "../Context/EmployeeContext/EmployeeContext.jsx";
import Card from "@mui/material/Card";

export default function EmployeeListPage() {
  const {employees} = use(EmployeeContext);

  return (
    <div>
      <h1>Employee list</h1>
      <ul>
        {employees.map(employee => (
          <li key={employee.id}>
            <Card
              style={{margin: '10px', padding: '10px'}}
            >
            {employee.name}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
