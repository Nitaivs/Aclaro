import {Link, useNavigate} from 'react-router';
import TasksIcon from '../assets/task.svg'
import TagsIcon from '../assets/tags.svg'
import EmployeesIcon from '../assets/employees.svg'
import ProcessesIcon from '../assets/process.svg'
import '../style/Navbar.css'

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
        <div className="navbar-container">
        <h3>Navigation</h3>
            <button onClick={() => navigate("/processes")} className={'navbar-button'}>
              <img src={ProcessesIcon} alt="Processes"/>
              <h4>Processes</h4>
            </button>
          <button onClick={() => navigate("/tasks")} className={'navbar-button'}>
            <img src={TasksIcon} alt="Tasks"/>
            <h4>Tasks</h4>
          </button>
          <button onClick={() => navigate("/employees")} className={'navbar-button'}>
            <img src={EmployeesIcon} alt="Employees"/><h4>Employees</h4>
          </button>
          <button onClick={() => navigate("/tags")} className={'navbar-button'}>
            <img src={TagsIcon} alt="Tags"/>
            <h4>Tags</h4>
          </button>
        </div>
    </nav>
  )
}
