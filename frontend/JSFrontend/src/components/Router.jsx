import {Route, Routes, BrowserRouter, useLocation} from "react-router";
import ProcessPage from "./ProcessPage.jsx";
import TaskPage from "./TaskPage.jsx";
import EmployeeListPage from "./EmployeeListPage.jsx";
import EmployeePage from "./EmployeePage.jsx";
import ProcessListPage from "./ProcessListPage.jsx";
import TaskListPage from "./TaskListPage.jsx";
import TagListPage from "./TagListPage.jsx";
import TaskModal from "./TaskModal.jsx";
import Navbar from "./Navbar.jsx";
import '../style/Content.css'

/**
 * @component AppRoutes
 * @description Defines the main application routes using React Router.
 * @returns {React.JSX.Element} The rendered AppRoutes component.
 */
function AppRoutes() {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<ProcessListPage/>}/>
        <Route path="/processes" element={<ProcessListPage/>}/>
        <Route path="/process/:processId" element={<ProcessPage/>}/>
        <Route path="/tasks" element={<TaskListPage/>}/>
        <Route path="/tasks/:taskId" element={<TaskPage/>}/>
        <Route path="/employees" element={<EmployeeListPage/>}/>
        <Route path="/employees/:employeeId" element={<EmployeePage/>}/>
        <Route path="/tags/" element={<TagListPage/>}/>
        <Route path="*" element={<h2>Page Not Found</h2>}/>
      </Routes>
      {background && (
        <Routes>
          <Route path={"/tasks/:taskId"} element={<TaskModal/>}/>
        </Routes>
      )}
    </>
  );
}

/**
 * @component Router
 * @description The Router component sets up the routing for the application using React Router.
 * It defines the routes to access other components.
 * @returns {JSX.Element} The Router component.
 */
export default function Router() {
  return (
    <BrowserRouter>
      <div className={"content"}>
        <Navbar/>
        <main style={{padding: 16}}>
          <AppRoutes/>
        </main>
      </div>
    </BrowserRouter>
  )
}
