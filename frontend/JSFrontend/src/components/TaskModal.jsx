import TaskPage from "./TaskPage.jsx";
import {useNavigate} from "react-router";
import {Dialog} from "@mui/material";
import '../style/Dialog.css'

export default function TaskModal() {
  const navigate = useNavigate();

  function handleClose() {
    navigate(-1);
  }

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      slotProps={{
        paper: {
            className: "dialog-paper",
        }
      }}
    >
      <TaskPage isModal={true}/>
    </Dialog>
  );
}
