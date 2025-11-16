import { useContext, useState } from "react";
import { DepartmentContext } from "../Context/EmployeeContext/EmployeeContext.jsx";
import AddDepartmentDialog from "./AddDepartmentDialog.jsx";
import { Link } from "react-router";
import {
    Alert,
    AlertTitle,
    TextField,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    IconButton
} from "@mui/material";
import Collapse from "@mui/material/Collapse";


export default function DepartmentListPage() {
    const { departments, addDepartment, deleteDepartmentById } = useContext(DepartmentContext);
    const [isAddDepartmentDialogOpen, setIsAddDepartmentDialogOpen] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [filterString, setFilterString] = useState("");
    const [removeMode, setRemoveMode] = useState(false);



}