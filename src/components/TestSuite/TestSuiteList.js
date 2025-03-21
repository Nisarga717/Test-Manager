import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTestSuites, deleteTestSuite } from "../../redux/actions/testSuiteActions";
import { 
  Table, TableHead, TableRow, TableCell, TableBody, 
  TablePagination, Button, CircularProgress, Typography, 
  Box, TextField
} from "@mui/material";
import TestSuiteForm from "./TestSuiteForm";

const TestSuiteList = () => {
  const dispatch = useDispatch();
  const testSuites = useSelector((state) => state.testSuites.testSuites);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openForm, setOpenForm] = useState(false);
  const [editingTestSuite, setEditingTestSuite] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchTestSuites());
      } catch (err) {
        setError("Failed to load test suites. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleOpenForm = (testSuite = null) => {
    setEditingTestSuite(testSuite);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setEditingTestSuite(null);
    setOpenForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this test suite?")) {
      dispatch(deleteTestSuite(id));
    }
  };

  // Apply Search Filter
  // Apply Search Filter
const filteredTestSuites = testSuites.filter((testSuite) =>
    (testSuite.title && testSuite.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (testSuite.description && testSuite.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Test Suites</Typography>

      {/* Search Feature */}
      <Box display="flex" gap={2} mb={2}>
        <TextField 
          label="Search Test Suites" 
          variant="outlined" 
          fullWidth 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </Box>

      <Button variant="contained" color="primary" onClick={() => handleOpenForm()} sx={{ mb: 2 }}>
        Add New Test Suite
      </Button>

      <TestSuiteForm open={openForm} handleClose={handleCloseForm} editingTestSuite={editingTestSuite} />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">{error}</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTestSuites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((testSuite) => (
              <TableRow key={testSuite.id}>
                <TableCell>{testSuite.title}</TableCell>
                <TableCell>{testSuite.description || "No Description"}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" size="small" onClick={() => handleOpenForm(testSuite)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" size="small" onClick={() => handleDelete(testSuite.id)} sx={{ ml: 1 }}>
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
        count={filteredTestSuites.length}
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

export default TestSuiteList;
