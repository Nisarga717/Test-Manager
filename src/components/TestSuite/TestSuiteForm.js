import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addTestSuite, updateTestSuite } from "../../redux/actions/testSuiteActions";
import {
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  TextField,
  Typography,
  Box,
  Divider,
  Paper,
  IconButton,
  Grid,
  useTheme
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import FolderIcon from "@mui/icons-material/Folder";
import Notification from "../common/notification";

const TestSuiteForm = ({ open, handleClose, editingTestSuite }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  const [errors, setErrors] = useState({});
  
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
    title: ""
  });

  useEffect(() => {
    if (editingTestSuite) {
      // Important: ensure we're making a deep copy of the editingTestSuite
      setFormData({
        ...editingTestSuite,
        title: editingTestSuite.title || "",
        description: editingTestSuite.description || ""
      });
    } else {
      setFormData({ title: "", description: "" });
    }
    setErrors({});
  }, [editingTestSuite, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  const showNotification = (message, severity, title) => {
    setNotification({
      open: true,
      message,
      severity,
      title
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      if (editingTestSuite) {
        // Log the data we're about to send
        console.log("Updating test suite with data:", formData);
        
        // Dispatch the update action and await its completion
        await dispatch(updateTestSuite(editingTestSuite.id, formData));
        
        // Close the form with success parameters
        handleClose(true, "update", formData.title);
      } else {
        // Handle creating a new test suite
        await dispatch(addTestSuite(formData));
        handleClose(true, "create", formData.title);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showNotification(
        `Failed to ${editingTestSuite ? "update" : "create"} test suite.`,
        "error",
        "Error"
      );
    }
  };

  const getHeaderBgColor = () => {
    if (theme.palette.mode === "dark") {
      return editingTestSuite ? "rgba(25, 118, 210, 0.2)" : "rgba(76, 175, 80, 0.2)";
    }
    return editingTestSuite ? "#e3f2fd" : "#e8f5e9";
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={() => handleClose(false)}
        fullWidth
        maxWidth="sm"
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
            <FolderIcon sx={{ mr: 1.5 }} />
            <Typography variant="h6" component="div">
              {editingTestSuite ? "Edit Test Suite" : "Add New Test Suite"}
            </Typography>
          </Box>
          <IconButton onClick={() => handleClose(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ padding: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Paper elevation={0} sx={{ 
              p: 2, 
              backgroundColor: theme.palette.background.paper, 
              borderRadius: 1, 
              mb: 2,
              border: `1px solid ${theme.palette.divider}`
            }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Test Suite Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    size="small"
                    error={!!errors.title}
                    helperText={errors.title}
                    sx={{ mb: 2 }}
                    placeholder="Enter a descriptive title for this test suite"
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
                    rows={4}
                    variant="outlined"
                    size="small"
                    placeholder="Describe the purpose and scope of this test suite..."
                  />
                </Grid>
              </Grid>
            </Paper>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Test suites can contain multiple test cases and help organize your testing workflow.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        
        <Divider />
        
        <DialogActions sx={{ padding: 2, justifyContent: "space-between" }}>
          <Button 
            onClick={() => handleClose(false)} 
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
          >
            {editingTestSuite ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Notification
        open={notification.open}
        message={notification.message}
        title={notification.title}
        severity={notification.severity}
        handleClose={handleNotificationClose}
        autoHideDuration={5000}
        position={{ vertical: "top", horizontal: "right" }}
      />
    </>
  );
};

export default TestSuiteForm;