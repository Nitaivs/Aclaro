import {Link} from "react-router"
import {use} from "react";
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";

/**
 * @component Dashboard
 * @description The main dashboard component. This component serves as the entry point to the application.
 * @return {JSX.Element} The rendered Dashboard component.
 */
export default function Dashboard() {
  const {processes} = use(ProcessContext);
  const {tasks} = use(TaskContext);

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
        {/*//TODO: remove debug button*/}
        <button onClick={() => console.log(processes, tasks)} style={
          {fontSize: '20px', padding: '10px 20px', marginTop: '20px', marginLeft: '20px'}
        }>Log State
        </button>
      </div>
      <div>
        <Link to="/tags/">
          <button style={
            {fontSize: '20px', padding: '10px 20px', marginTop: '20px'}
          }>Tag List
          </button>
        </Link>
      </div>
    </>
  )
}
