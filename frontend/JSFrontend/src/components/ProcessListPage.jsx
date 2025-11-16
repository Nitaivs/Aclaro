import ProcessesContainer from "./ProcessesContainer.jsx";
import {Link} from "react-router";

export default function ProcessListPage() {
  return (
    <div>
      <Link to={"/"}>
        <button>Return to dashboard</button>
      </Link>
      <h1>Processes</h1>
      <ProcessesContainer/>
    </div>
  )
}
