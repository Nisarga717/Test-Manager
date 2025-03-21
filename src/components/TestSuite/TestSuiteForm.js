import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addTestSuite, updateTestSuite } from "../../redux/actions/testSuiteActions";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField
} from "@mui/material";

const TestSuiteForm = ({ open, handleClose, editingTestSuite }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  useEffect(() => {
    if (editingTestSuite) {
      setFormData(editingTestSuite);
    } else {
      setFormData({ title: "", description: "" });
    }
  }, [editingTestSuite]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
      alert("Title is required!");
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
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{editingTestSuite ? "Edit Test Suite" : "Add New Test Suite"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          {editingTestSuite ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TestSuiteForm;
