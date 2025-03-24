import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTestCase, updateTestCase } from "../../redux/actions/testCaseActions";
import { fetchUsers } from "../../redux/actions/userActions";
import { fetchTestSuites } from "../../redux/actions/testSuiteActions"; // Import fetchTestSuites action
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Divider,
  Grid,
  Paper,
  IconButton,
  CircularProgress,
  useTheme
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import GroupIcon from "@mui/icons-material/Group";
import Notification from "../common/notification";

const TestCaseForm = ({ open, handleClose, editingTestCase }) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const testSuites = useSelector((state) => state.testSuites.testSuites);
  const loading = useSelector((state) => state.users.loading || state.testSuites.loading);
  const theme = useTheme(); // Get the current theme

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    executionStatus: "Pending",
    testSuiteId: "",
    assignedUserId: ""
  });

  const [errors, setErrors] = useState({});

  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    // Fetch both users and test suites when component mounts
    dispatch(fetchUsers());
    dispatch(fetchTestSuites()); // Add this to fetch test suites
  }, [dispatch]);

  useEffect(() => {
    if (editingTestCase) {
      setFormData(editingTestCase);
    } else {
      // Reset form when adding a new test case
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        executionStatus: "Pending",
        testSuiteId: "",
        assignedUserId: ""
      });
    }
    // Reset errors when opening/closing dialog
    setErrors({});
  }, [editingTestCase, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.testSuiteId) {
      newErrors.testSuiteId = "Test Suite is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (editingTestCase) {
      dispatch(updateTestCase(editingTestCase.id, formData));
      setNotification({ open: true, message: "Test case updated successfully", severity: "success" });
    } else {
      dispatch(addTestCase(formData));
      setNotification({ open: true, message: "Test case added successfully", severity: "success" });
    }

    handleClose();
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Priority colors that work in both light and dark modes
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return theme.palette.mode === "dark" ? "#f44336" : "#f44336"; // Red
      case "Medium": return theme.palette.mode === "dark" ? "#ff9800" : "#ff9800"; // Orange
      case "Low": return theme.palette.mode === "dark" ? "#4caf50" : "#4caf50"; // Green
      default: return theme.palette.text.secondary;
    }
  };

  // Header background colors adapted for dark mode
  const getHeaderBgColor = () => {
    if (theme.palette.mode === "dark") {
      return editingTestCase ? "rgba(25, 118, 210, 0.2)" : "rgba(76, 175, 80, 0.2)";
    }
    return editingTestCase ? "#e3f2fd" : "#e8f5e9";
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          elevation: 5,
          sx: {
            borderRadius: 2,
            bgcolor: theme.palette.background.paper
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: getHeaderBgColor(),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2
        }}>
          <Box display="flex" alignItems="center">
            <AssignmentIcon sx={{ mr: 1.5 }} />
            <Typography variant="h6" component="div">
              {editingTestCase ? "Edit Test Case" : "Add New Test Case"}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ padding: 3 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
              <CircularProgress />
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Title and Description Section */}
                <Grid item xs={12}>
                  <Paper elevation={0} sx={{
                    p: 2,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.divider}`
                  }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Basic Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          label="Title"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          fullWidth
                          error={!!errors.title}
                          helperText={errors.title}
                          required
                          variant="outlined"
                          size="small"
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          fullWidth
                          multiline
                          rows={3}
                          variant="outlined"
                          size="small"
                          placeholder="Describe the test case in detail..."
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Status and Priority Section */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{
                    p: 2,
                    backgroundColor: theme.palette.background.paper,
                    height: "100%",
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.divider}`
                  }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom display="flex" alignItems="center">
                      <PriorityHighIcon fontSize="small" sx={{ mr: 1 }} />
                      Status & Priority
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                          <InputLabel>Priority</InputLabel>
                          <Select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                  component="span"
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: getPriorityColor(selected),
                                    mr: 1
                                  }}
                                />
                                {selected}
                              </Box>
                            )}
                          >
                            <MenuItem value="Low">
                              <Box
                                component="span"
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  backgroundColor: getPriorityColor("Low"),
                                  mr: 1,
                                  display: 'inline-block'
                                }}
                              />
                              Low
                            </MenuItem>
                            <MenuItem value="Medium">
                              <Box
                                component="span"
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  backgroundColor: getPriorityColor("Medium"),
                                  mr: 1,
                                  display: 'inline-block'
                                }}
                              />
                              Medium
                            </MenuItem>
                            <MenuItem value="High">
                              <Box
                                component="span"
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  backgroundColor: getPriorityColor("High"),
                                  mr: 1,
                                  display: 'inline-block'
                                }}
                              />
                              High
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Execution Status</InputLabel>
                          <Select
                            name="executionStatus"
                            value={formData.executionStatus}
                            onChange={handleChange}
                          >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Passed">Passed</MenuItem>
                            <MenuItem value="Failed">Failed</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Association Section */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{
                    p: 2,
                    backgroundColor: theme.palette.background.paper,
                    height: "100%",
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.divider}`
                  }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom display="flex" alignItems="center">
                      <GroupIcon fontSize="small" sx={{ mr: 1 }} />
                      Associations
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormControl
                          fullWidth
                          size="small"
                          sx={{ mb: 2 }}
                          error={!!errors.testSuiteId}
                        >
                          <InputLabel>Associated Test Suite</InputLabel>
                          <Select
                            name="testSuiteId"
                            value={formData.testSuiteId}
                            onChange={handleChange}
                            required
                          >
                            {testSuites.length > 0 ? (
                              testSuites.map((suite) => (
                                <MenuItem key={suite.id} value={suite.id}>{suite.title}</MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled value="">No test suites available</MenuItem>
                            )}
                          </Select>
                          {errors.testSuiteId && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                              {errors.testSuiteId}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Assign to User</InputLabel>
                          <Select
                            name="assignedUserId"
                            value={formData.assignedUserId}
                            onChange={handleChange}
                          >
                            <MenuItem value="">None</MenuItem>
                            {users.length > 0 ? (
                              users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled value="">No users available</MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ padding: 2, justifyContent: "space-between" }}>
          <Button
            onClick={handleClose}
            color="inherit"
            variant="outlined"
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {editingTestCase ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification component moved outside the Dialog for better UX */}
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        handleClose={handleCloseNotification}
      />
    </>
  );
};

export default TestCaseForm;