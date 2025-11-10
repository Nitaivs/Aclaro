import { useContext } from 'react';
import { EmployeeContext } from "../Context/EmployeeContext/EmployeeContext.jsx";
import {
    Box,
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
    Typography
} from '@mui/material';

export default function EmployeeList() {
    const ctx = useContext(EmployeeContext);
    const employees = ctx?.employees;

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Employee List
            </Typography>

            <Paper variant="outlined" sx={{ p: 1 }}>
                <List>
                    {employees.length === 0 ? (
                        <ListItem>
                            <ListItemText
                                primary="No employees found"
                                secondary="There are currently no employees to display."
                            />
                        </ListItem>
                    ) : (
                        employees.map((emp, idx) => (
                            <div key={emp.id ?? idx}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar>{(emp.name || 'E').charAt(0)}</Avatar>
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={emp.name}
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="text.primary">
                                                    {emp.role}
                                                </Typography>
                                                {emp.email ? ` — ${emp.email}` : ''}
                                            </>
                                        }
                                    />
                                </ListItem>

                                {idx < employees.length - 1 && <Divider component="li" />}
                            </div>
                        ))
                    )}
                </List>
            </Paper>
        </Box>
    );
}