import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTestCases, deleteTestCase } from "../../redux/actions/testCaseActions";
import {
    Table, TableHead, TableRow, TableCell, TableBody,
    TablePagination, Button, CircularProgress, Typography,
    Box, TextField, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import TestCaseForm from "./TestCaseForm";

const TestCaseList = () => {
    const dispatch = useDispatch();
    const testCases = useSelector((state) => state.testCases.testCases);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openForm, setOpenForm] = useState(false);
    const [editingTestCase, setEditingTestCase] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchTestCases()).finally(() => setLoading(false));
    }, [dispatch]);

    const handleOpenForm = (testCase = null) => {
        setEditingTestCase(testCase);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setEditingTestCase(null);
        setOpenForm(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this test case?")) {
            dispatch(deleteTestCase(id));
        }
    };

    // Sorting Function
    const sortTestCases = (testCases) => {
        if (!sortField) return testCases; // No sorting applied

        return [...testCases].sort((a, b) => {
            if (sortField === "priority") {
                const priorityOrder = { Low: 1, Medium: 2, High: 3 };
                return sortOrder === "asc"
                    ? priorityOrder[a.priority] - priorityOrder[b.priority]
                    : priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            if (sortField === "executionStatus") {
                return sortOrder === "asc"
                    ? a.executionStatus.localeCompare(b.executionStatus)
                    : b.executionStatus.localeCompare(a.executionStatus);
            }
            return 0;
        });
    };

    // Apply Filters & Sorting
    const processedTestCases = sortTestCases(
        testCases.filter((testCase) =>
            (testCase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                testCase.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (statusFilter ? testCase.executionStatus === statusFilter : true)
        )
    );

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Test Cases</Typography>

            {/* Search, Filter, and Sorting Controls */}
            <Box display="flex" gap={2} mb={2}>
                <TextField
                    label="Search Test Cases"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FormControl fullWidth>
                    <InputLabel>Execution Status</InputLabel>
                    <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Passed">Passed</MenuItem>
                        <MenuItem value="Failed">Failed</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>Sort By</InputLabel>
                    <Select value={sortField} onChange={(e) => setSortField(e.target.value)}>
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="priority">Priority</MenuItem>
                        <MenuItem value="executionStatus">Execution Status</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>Order</InputLabel>
                    <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <MenuItem value="asc">Ascending</MenuItem>
                        <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Button variant="contained" color="primary" onClick={() => handleOpenForm()} sx={{ mb: 2 }}>
                Add New Test Case
            </Button>

            <TestCaseForm open={openForm} handleClose={handleCloseForm} editingTestCase={editingTestCase} />

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Title</strong></TableCell>
                            <TableCell><strong>Description</strong></TableCell>
                            <TableCell><strong>Execution Status</strong></TableCell>
                            <TableCell><strong>Priority</strong></TableCell>
                            <TableCell><strong>Associated Test Suite</strong></TableCell>
                            <TableCell><strong>Assigned User</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {processedTestCases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((testCase) => (
                            <TableRow key={testCase.id}>
                                <TableCell>{testCase.title}</TableCell>
                                <TableCell>{testCase.description || "No Description"}</TableCell>
                                <TableCell>{testCase.executionStatus}</TableCell>
                                <TableCell>{testCase.priority}</TableCell>
                                <TableCell>{testCase.testSuiteName || "Unassigned"}</TableCell>
                                <TableCell>{testCase.assignedUserName || "Unassigned"}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" size="small" onClick={() => handleOpenForm(testCase)}>
                                        Edit
                                    </Button>
                                    <Button variant="contained" color="secondary" size="small" onClick={() => handleDelete(testCase.id)} sx={{ ml: 1 }}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            )}

            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={processedTestCases.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                }}
            />
        </Box>
    );
};

export default TestCaseList;
