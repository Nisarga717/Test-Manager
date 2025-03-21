import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTestCase, updateTestCase } from "../../redux/actions/testCaseActions";
import { fetchUsers } from "../../redux/actions/userActions";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Select, MenuItem, FormControl, InputLabel
} from "@mui/material";

const TestCaseForm = ({ open, handleClose, editingTestCase }) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const testSuites = useSelector((state) => state.testSuites.testSuites);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    executionStatus: "Pending",
    testSuiteId: "",
    assignedUserId: ""
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (editingTestCase) {
      setFormData(editingTestCase);
    }
  }, [editingTestCase]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.testSuiteId) {
      alert("Title and Associated Test Suite are required!");
      return;
    }

    if (editingTestCase) {
      dispatch(updateTestCase(editingTestCase.id, formData));
    } else {
      dispatch(addTestCase(formData));
    }

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{editingTestCase ? "Edit Test Case" : "Add New Test Case"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField label="Title" name="title" value={formData.title} onChange={handleChange} fullWidth required />
          <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth />

          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select name="priority" value={formData.priority} onChange={handleChange}>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Execution Status</InputLabel>
            <Select name="executionStatus" value={formData.executionStatus} onChange={handleChange}>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Passed">Passed</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Associated Test Suite</InputLabel>
            <Select name="testSuiteId" value={formData.testSuiteId} onChange={handleChange}>
              {testSuites.map((suite) => (
                <MenuItem key={suite.id} value={suite.id}>{suite.title}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Assign to User</InputLabel>
            <Select name="assignedUserId" value={formData.assignedUserId} onChange={handleChange}>
              <MenuItem value="">None</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">{editingTestCase ? "Update" : "Add"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TestCaseForm;
