import {Link} from "react-router"

/**
 * @component Dashboard
 * @description The main dashboard component. This component serves as the entry point to the application.
 * @return {JSX.Element} The rendered Dashboard component.
 */
export default function Dashboard() {
  return (
    <>
      <div>
        <h1>ProSeed</h1>
        <Link to="/processes">
          <button style={
            {fontSize: '20px', padding: '10px 20px', marginTop: '20px'}
          }>Process list
          </button>
        </Link>
      </div>
      <div>
        <Link to="/employees">
          <button style={
            {fontSize: '20px', padding: '10px 20px', marginTop: '20px'}
          }>Employee List
          </button>
        </Link>
      </div>
    </>
  )
}
