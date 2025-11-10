import { useContext, useState } from 'react';
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
    Typography,
    TextField
} from '@mui/material';

/**
 * @component EmployeeList
 * @description A component that displays a list of employees
 * @returns {JSX.Element} The rendered ProcessCard component.
 */
export default function EmployeeList() {
    const ctx = useContext(EmployeeContext);
    const employees = ctx.employees;
    const [query, setQuery] = useState('');

    // Filter employees based on the search query
    const filtered = employees.filter(emp =>
        (emp?.name || '').toLowerCase().includes(query.trim().toLowerCase())
    );

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Employee List
            </Typography>
            {/* Search Field */}
            <TextField
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name"
                fullWidth
                size="small"
                color="white"
                sx={{
                    mb: 1,
                    '& .MuiInputBase-root': {
                        backgroundColor: 'white',
                        borderRadius: 1,
                    },
                }}
            />

            <Paper variant="outlined" sx={{ p: 1 }}>
                <List>
                    {filtered.length === 0 ? (
                        <ListItem>
                            <ListItemText
                                primary="No employees found"
                                secondary={query ? `No employees match "${query}".` : "There are currently no employees to display."}
                            />
                        </ListItem>
                    ) : (
                        filtered.map((emp, idx) => (
                            <div key={emp.id ?? idx}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar></Avatar>
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={emp?.name}
                                    />
                                </ListItem>

                                {idx < filtered.length - 1 && <Divider component="li" />}
                            </div>
                        ))
                    )}
                </List>
            </Paper>
        </Box>
    );
}