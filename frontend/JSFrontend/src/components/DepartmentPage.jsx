import { Link } from "react-router";
import { useContext, useState } from 'react';
import { TagContext } from "../Context/TagContext/TagContext.jsx";
import { useParams } from "react-router";
import EditEmployeeDialog from "./EditEmployeeDialog.jsx";
//import EditDepartmentDialog from "./EditDepartmentDialog.jsx";
//TODO: When ready above component is ready, uncomment


export default function DepartmentPage() {
    const { departments, updateDepartment } = useContext(TagContext);
    const { departmentId } = useParams();
    const parsedDepartmentId = departmentId ? parseInt(departmentId) : undefined;
    const foundDepartment = departments.find(d => d.id === parseInt(departmentId));
    const [isEditDepartmentDialogOpen, setIsEditDepartmentDialogOpen] = useState(false);

    function handleUpdateDepartment(updatedName) {
        updateDepartment(parsedDepartmentId, updatedName);
        setIsEditDepartmentDialogOpen(false);
    }

    if (!parsedDepartmentId) {
        return (
          <div>
            <h1>Department Page</h1>
            <p>Error: Invalid deparment ID.</p>
            <Link to="/departments">
              <button>
                Return to deparment list
              </button>
            </Link>
          </div>
        );
      }

      if (!foundDepartment) {
        return (
          <div>
            <h1>Department Page</h1>
            <p>Error: Department with id: {parsedDepartmentId} not found.</p>
            <Link to="/departments">
              <button>
                Return to department list
              </button>
            </Link>
          </div>
        );
      }

      return (
        <div>
          <Link to="/departments">
            <button>
              Return to department list
            </button>
          </Link>
          <h2>Department Page</h2>
          <h1>{foundDepartment.name}</h1>
          <button onClick={() => setIsEditDepartmentDialogOpen(true)}>
            Edit Department
          </button>
          <EditEmployeeDialog
            currentName={foundDepartment.name}
            isOpen={isEditDepartmentDialogOpen}
            onClose={() => setIsEditDepartmentDialogOpen(false)}
            onSave={handleUpdateDepartment}
          />
        </div>
      );
}
