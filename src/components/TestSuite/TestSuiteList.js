import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTestSuites, deleteTestSuite } from "../../redux/actions/testSuiteActions";
import { 
  Table, TableHead, TableRow, TableCell, TableBody, 
  TablePagination, Button, CircularProgress, Typography, 
  Box, TextField, Paper, Stack, IconButton, Tooltip,
  Card, CardContent, Alert, Fade, InputAdornment,
  useTheme
} from "@mui/material";
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from "@mui/icons-material";
import TestSuiteForm from "./TestSuiteForm";

const TestSuiteList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const testSuites = useSelector((state) => state.testSuites.testSuites);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openForm, setOpenForm] = useState(false);
  const [editingTestSuite, setEditingTestSuite] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ open: false, id: null });

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

  const handleDeleteConfirm = (id) => {
    setDeleteConfirmation({ open: true, id });
  };

  const handleDelete = () => {
    dispatch(deleteTestSuite(deleteConfirmation.id));
    setDeleteConfirmation({ open: false, id: null });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ open: false, id: null });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Apply Search Filter
  const filteredTestSuites = testSuites.filter((testSuite) =>
    (testSuite.title && testSuite.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (testSuite.description && testSuite.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Test Suites
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and organize your test suites
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField 
            label="Search Test Suites" 
            variant="outlined" 
            fullWidth 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearSearch}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            size="small"
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleOpenForm()} 
            startIcon={<AddIcon />}
            sx={{ minWidth: '180px' }}
          >
            Add Test Suite
          </Button>
        </Stack>

        {deleteConfirmation.open && (
          <Fade in={deleteConfirmation.open}>
            <Alert 
              severity="warning" 
              sx={{ mb: 3 }}
              action={
                <>
                  <Button color="inherit" size="small" onClick={handleCancelDelete} sx={{ mr: 1 }}>
                    Cancel
                  </Button>
                  <Button color="error" size="small" onClick={handleDelete} variant="contained">
                    Delete
                  </Button>
                </>
              }
            >
              Are you sure you want to delete this test suite? This action cannot be undone.
            </Alert>
          </Fade>
        )}

        <TestSuiteForm open={openForm} handleClose={handleCloseForm} editingTestSuite={editingTestSuite} />

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
        ) : filteredTestSuites.length === 0 ? (
          <Paper 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.02)' 
            }}
          >
            <Typography color="textSecondary">
              {searchQuery ? "No test suites match your search criteria" : "No test suites available"}
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => handleOpenForm()} 
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
            >
              Create your first test suite
            </Button>
          </Paper>
        ) : (
          <Paper 
            elevation={0} 
            variant="outlined" 
            sx={{ mb: 2, overflow: 'hidden' }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ 
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.04)' 
                }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', width: '160px' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTestSuites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((testSuite) => (
                  <TableRow 
                    key={testSuite.id} 
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.08)' 
                          : 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    <TableCell>{testSuite.title}</TableCell>
                    <TableCell>{testSuite.description || "—"}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton color="primary" size="small" onClick={() => handleOpenForm(testSuite)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          color="error" 
                          size="small" 
                          onClick={() => handleDeleteConfirm(testSuite.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
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
      </CardContent>
    </Card>
  );
};

export default TestSuiteList;