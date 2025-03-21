import { FETCH_TEST_CASES, ADD_TEST_CASE, UPDATE_TEST_CASE, DELETE_TEST_CASE } from "../types";

const initialState = {
  testCases: [],
};

export default function testCaseReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TEST_CASES:
      return { ...state, testCases: action.payload };
    case ADD_TEST_CASE:
      return { ...state, testCases: [...state.testCases, action.payload] };
    case UPDATE_TEST_CASE:
      return {
        ...state,
        testCases: state.testCases.map((testCase) =>
          testCase.id === action.payload.id ? action.payload.updatedData : testCase
        ),
      };
    case DELETE_TEST_CASE:
      return {
        ...state,
        testCases: state.testCases.filter((testCase) => testCase.id !== action.payload),
      };
    default:
      return state;
  }
}
