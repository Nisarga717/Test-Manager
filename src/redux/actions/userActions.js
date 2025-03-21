import axios from "axios";
import { FETCH_USERS } from "../types";

const API_URL_USERS = "http://localhost:5000/users";

// Fetch users
export const fetchUsers = () => async (dispatch) => {
  try {
    const response = await axios.get(API_URL_USERS);
    dispatch({ type: FETCH_USERS, payload: response.data });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
