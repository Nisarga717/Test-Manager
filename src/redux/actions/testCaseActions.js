import axios from "axios";
import { FETCH_TEST_CASES, ADD_TEST_CASE, UPDATE_TEST_CASE, DELETE_TEST_CASE } from "../types";

const API_URL_CASES = "http://localhost:5000/testCases";
const API_URL_SUITES = "http://localhost:5000/testSuites";
const API_URL_USERS = "http://localhost:5000/users";

// Fetch test cases with associated test suite names and assigned user names
export const fetchTestCases = () => async (dispatch) => {
    try {
        const [casesResponse, suitesResponse, usersResponse] = await Promise.all([
            axios.get(API_URL_CASES),
            axios.get(API_URL_SUITES),
            axios.get(API_URL_USERS)
        ]);

        const testSuites = suitesResponse.data;
        const users = usersResponse.data;

        // Map test cases to include test suite name and assigned user name
        const testCases = casesResponse.data.map(testCase => {
            const associatedSuite = testSuites.find(suite => suite.id === testCase.testSuiteId);
            const assignedUser = users.find(user => user.id === testCase.assignedUserId);

            return { 
                ...testCase, 
                testSuiteName: associatedSuite ? associatedSuite.title : "Unassigned",
                assignedUserName: assignedUser ? assignedUser.name : "Unassigned"
            };
        });

        dispatch({ type: FETCH_TEST_CASES, payload: testCases });
    } catch (error) {
        console.error("Error fetching test cases:", error);
        alert("Failed to fetch test cases. Please try again.");
    }
};



// Add new test case
export const addTestCase = (testCase) => async (dispatch) => {
    try {
        if (!testCase.title) {
            alert("Title is required for a test case.");
            return;
        }

        const response = await axios.post(API_URL_CASES, testCase);
        dispatch({ type: ADD_TEST_CASE, payload: response.data });

        // Refresh test case list
        dispatch(fetchTestCases());
    } catch (error) {
        console.error("Error adding test case:", error);
        alert("Failed to add test case. Please try again.");
    }
};

// Update test case
export const updateTestCase = (id, updatedData) => async (dispatch) => {
    try {
        await axios.put(`${API_URL_CASES}/${id}`, updatedData);
        dispatch({ type: UPDATE_TEST_CASE, payload: { id, updatedData } });

        // Refresh test case list
        dispatch(fetchTestCases());
    } catch (error) {
        console.error("Error updating test case:", error);
        alert("Failed to update test case. Please try again.");
    }
};

// Delete test case
export const deleteTestCase = (id) => async (dispatch) => {
    try {
        await axios.delete(`${API_URL_CASES}/${id}`);
        dispatch({ type: DELETE_TEST_CASE, payload: id });

        // Refresh test case list
        dispatch(fetchTestCases());
    } catch (error) {
        console.error("Error deleting test case:", error);
        alert("Failed to delete test case. Please try again.");
    }
};
