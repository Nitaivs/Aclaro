import TaskPage from "./TaskPage.jsx";
import {useNavigate} from "react-router";
import {Dialog} from "@mui/material";
import '../style/Dialog.css'

/**
 * @component TaskModal
 * @description A modal dialog component that displays the TaskPage.
 * It uses React Router's useNavigate hook to handle closing the modal
 * by navigating back to the previous page.
 * @returns {React.JSX.Element} The rendered TaskModal component.
 */
export default function TaskModal() {
  const navigate = useNavigate();

  function handleClose() {
    navigate(-1);
  }

  return (
    <Dialog
      slotProps={{
        paper: {
          className: "dialog-paper"
        }
      }}
      open={true}
      onClose={handleClose}
    >
      <TaskPage isModal={true}/>
    </Dialog>
  );
}
