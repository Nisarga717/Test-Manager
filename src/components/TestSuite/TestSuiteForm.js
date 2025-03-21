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
  Grid
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import FolderIcon from "@mui/icons-material/Folder";

const TestSuiteForm = ({ open, handleClose, editingTestSuite }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTestSuite) {
      setFormData(editingTestSuite);
    } else {
      setFormData({ title: "", description: "" });
    }
    // Reset errors when opening/closing dialog
    setErrors({});
  }, [editingTestSuite, open]);

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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    if (editingTestSuite) {
      dispatch(updateTestSuite(editingTestSuite.id, formData));
    } else {
      dispatch(addTestSuite(formData));
    }

    handleClose(); // Close the dialog after submitting
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        elevation: 5,
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: editingTestSuite ? "#e3f2fd" : "#e8f5e9", 
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
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ padding: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Paper elevation={0} sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 1, mb: 2 }}>
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
            <Typography variant="caption" color="textSecondary">
              Test suites can contain multiple test cases and help organize your testing workflow.
            </Typography>
          </Box>
        </Box>
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
        >
          {editingTestSuite ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TestSuiteForm;