import {Link} from 'react-router';
import TasksIcon from '../assets/task.svg'
import TagsIcon from '../assets/tags.svg'
import EmployeesIcon from '../assets/employees.svg'
import ProcessesIcon from '../assets/process.svg'
import '../style/Navbar.css'

export default function Navbar() {

  return (
    <nav className="navbar">
        <div className="navbar-container">
        <h3>Navigation</h3>
          <Link className={"navbar-button"} to="/processes">
              <img src={ProcessesIcon} alt="Processes"/>
              <h4>Processes</h4>
          </Link>
          <Link className={"navbar-button"} to="/tasks">
            <img src={TasksIcon} alt="Tasks"/>
            <h4>Tasks</h4>
          </Link>
          <Link className={"navbar-button"} to="/employees">
            <img src={EmployeesIcon} alt="Employees"/>
            <h4>Employees</h4>
          </Link>
          <Link className={"navbar-button"} to="/tags">
            <img src={TagsIcon} alt="Tags"/>
            <h4>Tags</h4>
          </Link>
        </div>
    </nav>
  )
}
