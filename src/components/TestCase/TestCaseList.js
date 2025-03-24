import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTestCases, deleteTestCase } from "../../redux/actions/testCaseActions";
import {
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody,
  TablePagination, 
  Button, 
  CircularProgress, 
  Typography,
  Box, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Card,
  CardContent,
  Stack,
  Divider,
  TableContainer,
  Alert,
  Grid,
  InputAdornment,
  useTheme,
  alpha
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon
} from "@mui/icons-material";
import TestCaseForm from "./TestCaseForm";
import Notification from "../common/notification";


const TestCaseList = () => {
  const theme = useTheme();
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
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ open: false, id: null, title: "" });
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchTestCases())
      .then(() => setLoading(false))
      .catch(err => {
        setError(err.message || "Failed to fetch test cases");
        setLoading(false);
      });
  }, [dispatch]);

  const handleOpenForm = (testCase = null) => {
    setEditingTestCase(testCase);
    setOpenForm(true);
  };

  const handleCloseForm = (updated = false, testCaseData = null) => {
    setEditingTestCase(null);
    setOpenForm(false);
    
    if (updated && testCaseData) {
      setNotification({
        open: true,
        message: `Test case "${testCaseData.title}" updated successfully`,
        severity: "success"
      });
    } else if (updated) {
      setNotification({
        open: true,
        message: "Test case created successfully",
        severity: "success"
      });
    }
  };

  const handleDeleteConfirm = (id, title) => {
    setDeleteConfirmation({ open: true, id, title });
  };

  const handleDelete = () => {
    dispatch(deleteTestCase(deleteConfirmation.id));
    
    setNotification({ 
      open: true, 
      message: `Test case "${deleteConfirmation.title}" deleted successfully`, 
      severity: "success" 
    });
  
    setDeleteConfirmation({ open: false, id: null, title: "" });
  };
  
  const handleCancelDelete = () => {
    setDeleteConfirmation({ open: false, id: null, title: "" });
  };

  const handleRefresh = () => {
    setLoading(true);
    dispatch(fetchTestCases())
      .then(() => setLoading(false))
      .catch(err => {
        setError(err.message || "Failed to fetch test cases");
        setLoading(false);
      });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setSortField("");
    setSortOrder("asc");
  };

  // Get priority color - theme aware
  const getPriorityColor = (priority) => {
    const isDark = theme.palette.mode === 'dark';
    
    switch (priority) {
      case "High":
        return { 
          bg: isDark ? alpha('#d32f2f', 0.2) : '#ffebee', 
          color: isDark ? '#ff6060' : '#d32f2f' 
        };
      case "Medium":
        return { 
          bg: isDark ? alpha('#ff8f00', 0.2) : '#fff8e1', 
          color: isDark ? '#ffb74d' : '#ff8f00' 
        };
      case "Low":
        return { 
          bg: isDark ? alpha('#2e7d32', 0.2) : '#e8f5e9', 
          color: isDark ? '#66bb6a' : '#2e7d32' 
        };
      default:
        return { 
          bg: isDark ? alpha('#757575', 0.2) : '#f5f5f5', 
          color: isDark ? '#bdbdbd' : '#757575' 
        };
    }
  };

  // Get status color - theme aware
  const getStatusColor = (status) => {
    const isDark = theme.palette.mode === 'dark';
    
    switch (status) {
      case "Passed":
        return { 
          bg: isDark ? alpha('#2e7d32', 0.2) : '#e8f5e9', 
          color: isDark ? '#66bb6a' : '#2e7d32' 
        };
      case "Failed":
        return { 
          bg: isDark ? alpha('#d32f2f', 0.2) : '#ffebee', 
          color: isDark ? '#ff6060' : '#d32f2f' 
        };
      case "In Progress":
        return { 
          bg: isDark ? alpha('#1976d2', 0.2) : '#e3f2fd', 
          color: isDark ? '#64b5f6' : '#1976d2' 
        };
      case "Pending":
        return { 
          bg: isDark ? alpha('#ff8f00', 0.2) : '#fff8e1', 
          color: isDark ? '#ffb74d' : '#ff8f00' 
        };
      default:
        return { 
          bg: isDark ? alpha('#757575', 0.2) : '#f5f5f5', 
          color: isDark ? '#bdbdbd' : '#757575' 
        };
    }
  };

  // Sorting Function
  const sortTestCases = (testCases) => {
    if (!sortField) return testCases; // No sorting applied

    return [...testCases].sort((a, b) => {
      if (sortField === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
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
      (testCase.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        testCase.description?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter ? testCase.executionStatus === statusFilter : true)
    )
  );

  // Theme-based style variables
  const filterPaperBg = theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.paper, 0.6)
    : alpha(theme.palette.action.hover, 0.1);
    
  const tableHeadBg = theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.8)
    : alpha(theme.palette.action.hover, 0.1);
    
  const emptyStateBg = theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.6)
    : alpha(theme.palette.action.hover, 0.1);
    
  const actionButtonBgPrimary = theme.palette.mode === 'dark'
    ? alpha(theme.palette.primary.main, 0.2)
    : alpha(theme.palette.primary.main, 0.08);
    
  const actionButtonBgError = theme.palette.mode === 'dark'
    ? alpha(theme.palette.error.main, 0.2)
    : alpha(theme.palette.error.main, 0.08);

  return (
    <Box p={3}>
      <Card elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: "visible" }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
              Test Cases
              {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
            </Typography>
            
            <Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenForm()}
                sx={{ 
                  borderRadius: 8, 
                  px: 2,
                  boxShadow: 2
                }}
              >
                New Test Case
              </Button>
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh} sx={{ ml: 1 }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={showFilters ? "Hide Filters" : "Show Filters"}>
                <IconButton onClick={() => setShowFilters(!showFilters)} sx={{ ml: 1 }}>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Delete Confirmation Alert */}
          {deleteConfirmation.open && (
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
              Are you sure you want to delete the test case "{deleteConfirmation.title}"? This action cannot be undone.
            </Alert>
          )}

          {/* Search, Filter, and Sorting Controls */}
          <Box mb={3}>
            <TextField
              placeholder="Search test cases..."
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery("")}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
              size="small"
            />
          </Box>

          {showFilters && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                mb: 3, 
                backgroundColor: filterPaperBg, 
                borderRadius: 2 
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Execution Status</InputLabel>
                    <Select 
                      value={statusFilter} 
                      onChange={(e) => setStatusFilter(e.target.value)}
                      sx={{ borderRadius: 1 }}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Passed">Passed</MenuItem>
                      <MenuItem value="Failed">Failed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Sort By</InputLabel>
                    <Select 
                      value={sortField} 
                      onChange={(e) => setSortField(e.target.value)}
                      sx={{ borderRadius: 1 }}
                    >
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value="title">Title</MenuItem>
                      <MenuItem value="priority">Priority</MenuItem>
                      <MenuItem value="executionStatus">Execution Status</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Order</InputLabel>
                    <Select 
                      value={sortOrder} 
                      onChange={(e) => setSortOrder(e.target.value)}
                      sx={{ borderRadius: 1 }}
                    >
                      <MenuItem value="asc">Ascending</MenuItem>
                      <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={resetFilters}
                    sx={{ borderRadius: 1 }}
                  >
                    Reset Filters
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Error loading test cases: {error}
            </Alert>
          )}

          {loading && !testCases.length ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
              <CircularProgress />
            </Box>
          ) : processedTestCases.length === 0 ? (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                textAlign: "center", 
                backgroundColor: emptyStateBg, 
                borderRadius: 2 
              }}
            >
              <Typography variant="h6" color="textSecondary">
                No test cases found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {searchQuery || statusFilter ? 
                  "Try adjusting your search or filters" : 
                  "Create your first test case to get started"}
              </Typography>
              {!searchQuery && !statusFilter && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenForm()}
                  sx={{ mt: 2, borderRadius: 8 }}
                >
                  Create Test Case
                </Button>
              )}
            </Paper>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ backgroundColor: tableHeadBg }}>
                  <TableRow>
                    <TableCell><Typography fontWeight="bold">Title</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Description</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Priority</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Test Suite</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Assigned To</Typography></TableCell>
                    <TableCell align="center"><Typography fontWeight="bold">Actions</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processedTestCases
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((testCase) => (
                      <TableRow 
                        key={testCase.id} 
                        hover
                        sx={{
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? alpha(theme.palette.action.hover, 0.1) 
                              : alpha(theme.palette.action.hover, 0.05)
                          }
                        }}
                      >
                        <TableCell>
                          <Typography fontWeight="medium">{testCase.title}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary" sx={{ 
                            maxWidth: 200,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {testCase.description || "No description"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={testCase.executionStatus} 
                            size="small"
                            sx={{ 
                              backgroundColor: getStatusColor(testCase.executionStatus).bg,
                              color: getStatusColor(testCase.executionStatus).color,
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={testCase.priority} 
                            size="small"
                            sx={{ 
                              backgroundColor: getPriorityColor(testCase.priority).bg,
                              color: getPriorityColor(testCase.priority).color,
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {testCase.testSuiteName ? (
                            <Chip 
                              label={testCase.testSuiteName} 
                              size="small" 
                              variant="outlined"
                              sx={{ borderRadius: 1 }}
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">Unassigned</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {testCase.assignedUserName ? (
                            <Box display="flex" alignItems="center">
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  backgroundColor: theme.palette.primary.main,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: theme.palette.primary.contrastText,
                                  mr: 1,
                                  fontSize: '0.75rem'
                                }}
                              >
                                {testCase.assignedUserName.charAt(0).toUpperCase()}
                              </Box>
                              <Typography variant="body2">{testCase.assignedUserName}</Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">Unassigned</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="Edit">
                              <IconButton 
                                size="small" 
                                color="primary" 
                                onClick={() => handleOpenForm(testCase)}
                                sx={{ backgroundColor: actionButtonBgPrimary }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDeleteConfirm(testCase.id, testCase.title)}
                                sx={{ backgroundColor: actionButtonBgError }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              
              <Divider />
              
              <Box display="flex" justifyContent="space-between" alignItems="center" px={2}>
                <Typography variant="body2" color="textSecondary">
                  Showing {processedTestCases.length === 0 ? 0 : Math.min(processedTestCases.length, page * rowsPerPage + 1)} to{" "}
                  {Math.min(processedTestCases.length, page * rowsPerPage + rowsPerPage)} of{" "}
                  {processedTestCases.length} entries
                </Typography>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={processedTestCases.length}
                  rowsPerPage={rowsPerPage}
                  page={processedTestCases.length === 0 ? 0 : page}
                  onPageChange={(event, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                  }}
                  sx={{
                    '.MuiTablePagination-toolbar': {
                      padding: 0
                    },
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                      margin: 0
                    }
                  }}
                />
              </Box>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <TestCaseForm open={openForm} handleClose={handleCloseForm} editingTestCase={editingTestCase} />
      <Notification open={notification.open} message={notification.message} severity={notification.severity} handleClose={() => setNotification({ ...notification, open: false })} />

    </Box>
  );
};

export default TestCaseList;