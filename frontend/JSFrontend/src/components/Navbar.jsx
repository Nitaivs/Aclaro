import {Link} from 'react-router';

export default function Navbar() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: 240,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      padding: 16,
      borderRight: '1px solid #ccc',
    }}>
      <div>
        <h1>ProSeed</h1>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 32}}>
        <Link to="/">
          <button>
            Dashboard
          </button>
        </Link>
        <Link to="/processes">
          <button>
            Processes
          </button>
        </Link>
        <Link to="/tasks">
          <button>
            Tasks
          </button>
        </Link>
        <Link to="/employees">
          <button>
            Employees
          </button>
        </Link>
      </div>
    </nav>
  )
}
