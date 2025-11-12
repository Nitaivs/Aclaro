import { Route, Routes, BrowserRouter } from "react-router";
import Dashboard from "./Dashboard.jsx";
import ProcessPage from "./ProcessPage.jsx";
import TaskPage from "./TaskPage.jsx";
import EmployeeListPage from "./EmployeeListPage.jsx";
import EmployeePage from "./EmployeePage.jsx";
import ProcessListPage from "./ProcessListPage.jsx";

/**
 * @component Router
 * @description The Router component sets up the routing for the application using React Router.
 * It defines the routes to access other components.
 * @returns {JSX.Element} The Router component.
 */
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/processes" element={<ProcessListPage/>}/>
        <Route path="/process/:processId" element={<ProcessPage/>}/>
        <Route path="/process/:processId/task/:taskId" element={<TaskPage/>}/>
        <Route path="/employees" element={<EmployeeListPage/>}/>
        <Route path="/employees/:employeeId" element={<EmployeePage/>}/>
      </Routes>
    </BrowserRouter>
  )
}
