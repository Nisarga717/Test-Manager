import { FETCH_TEST_SUITES, ADD_TEST_SUITE } from "../types";

const initialState = {
  testSuites: [],
};

export default function testSuiteReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TEST_SUITES:
      return { ...state, testSuites: action.payload };
    case ADD_TEST_SUITE:
      return { ...state, testSuites: [...state.testSuites, action.payload] };
    default:
      return state;
  }
}
