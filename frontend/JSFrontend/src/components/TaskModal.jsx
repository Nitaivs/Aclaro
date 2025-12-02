import TaskPage from "./TaskPage.jsx";
import {useNavigate} from "react-router";
import {Dialog} from "@mui/material";

export default function TaskModal() {
  const navigate = useNavigate();

  function handleClose() {
    navigate(-1);
  }

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: '18px',
          overflow: 'hidden'
        }
      }}
    >
      <TaskPage isModal={true}/>
    </Dialog>
  );
}
