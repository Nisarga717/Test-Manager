import React from "react";
import TestCaseList from "../components/TestCase/TestCaseList";
import TestCaseForm from "../components/TestCase/TestCaseForm";

const TestCasesPage = () => {
  return (
    <div>
      <h2>Test Cases</h2>
      <TestCaseForm />
      <TestCaseList />
    </div>
  );
};

export default TestCasesPage;
