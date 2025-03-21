import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./styles/theme"; // ✅ Import theme function
import Navbar from "./components/Navbar";
import TestCasesPage from "./pages/TestCasePage";
import TestSuitesPage from "./pages/TestSuitePage";

function App() {
  // Load Dark Mode preference from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"; // Default to saved value
  });

  // Save Dark Mode preference whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <ThemeProvider theme={getTheme(darkMode)}>
      <CssBaseline /> {/* Ensures consistent dark/light backgrounds */}
      <Router>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/test-cases" element={<TestCasesPage />} />
          <Route path="/test-suites" element={<TestSuitesPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
