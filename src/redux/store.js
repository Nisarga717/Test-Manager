import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import testCaseReducer from "./reducers/testCaseReducer";
import testSuiteReducer from "./reducers/testSuiteReducer";
import userReducer from "./reducers/userReducer";

const rootReducer = combineReducers({
  testCases: testCaseReducer,
  testSuites: testSuiteReducer,
  users: userReducer
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk)
);

export default store;
