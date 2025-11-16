import { Link } from "react-router";
import { use, useEffect, useState } from 'react';
import { DepartmentContext } from "../Context/DepartmentContext/DepartmentContext.jsx";
import { useParams } from "react-router";

//import EditDepartmentDialog from "./EditDepartmentDialog.jsx";
//TODO: When ready above component is ready, uncomment


export default function DepartmentPage() {
    const { departments, updateDepartment } = useContext(DepartmentContext);
    const { departmentId } = useParams();
    const parsedDepartmentId = departmentId ? parseInt(departmentId) : undefined;
    const foundDepartment = departments.find(d => d.id === parseInt(departmentId));
    const [isEditDepartmentDialogOpen, setIsEditDepartmentDialogOpen] = useState(false);

    function handleUpdateDepartment(updatedName) {
        updateDepartment(parsedDepartmentId, updatedName);
        setIsEditDepartmentDialogOpen(false);
    }

    return (
        <div>
            <h1>Department Page</h1>
            <h2>Not ready yet :/</h2>
        </div>
    );
}