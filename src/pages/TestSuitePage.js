import React from "react";
import TestSuiteList from "../components/TestSuite/TestSuiteList";
import TestSuiteForm from "../components/TestSuite/TestSuiteForm";

const TestSuitesPage = () => {
  return (
    <div>
      <h2>Test Suites</h2>
      <TestSuiteForm />
      <TestSuiteList />
    </div>
  );
};

export default TestSuitesPage;
