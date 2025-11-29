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
      slotProps={{
        paper: {
          sx: {
            overflow: 'hidden',
            borderRadius: '18px'
          }
        }
      }}
      open={true}
      onClose={handleClose}
    >
      <TaskPage isModal={true}/>
    </Dialog>
  );
}
