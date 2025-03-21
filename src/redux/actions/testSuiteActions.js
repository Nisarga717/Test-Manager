import axios from "axios";
import { FETCH_TEST_SUITES, ADD_TEST_SUITE } from "../types";

const API_URL = "http://localhost:5000/testSuites";

// Fetch test suites
export const fetchTestSuites = () => async (dispatch) => {
  try {
    const response = await axios.get(API_URL);
    dispatch({ type: FETCH_TEST_SUITES, payload: response.data });
  } catch (error) {
    console.error("Error fetching test suites:", error);
  }
};

// Add new test suite
export const addTestSuite = (testSuite) => async (dispatch) => {
  try {
    const response = await axios.post(API_URL, testSuite);
    dispatch({ type: ADD_TEST_SUITE, payload: response.data });
  } catch (error) {
    console.error("Error adding test suite:", error);
  }
};

// Update test suite
export const updateTestSuite = (id, updatedData) => async (dispatch) => {
  try {
    await axios.put(`${API_URL}/${id}`, updatedData);
    dispatch({ type: "UPDATE_TEST_SUITE", payload: { id, updatedData } });
  } catch (error) {
    console.error("Error updating test suite:", error);
  }
};

// Delete test suite
export const deleteTestSuite = (id) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    dispatch({ type: "DELETE_TEST_SUITE", payload: id });
  } catch (error) {
    console.error("Error deleting test suite:", error);
  }
};
