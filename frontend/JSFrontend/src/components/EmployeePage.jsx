import { Link, useParams } from "react-router";
import { use, useState } from 'react';
import { EmployeeContext } from "../Context/EmployeeContext/EmployeeContext.jsx";



export default function EmployeePage() {
    const { employeeId } = useParams();
    const { editedEmployee, updateEmployee, fetchEmployeeById } = use(EmployeeContext);
    const { employee, addEmployee } = use(employeeContext);

}