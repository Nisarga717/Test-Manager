import { createTheme } from "@mui/material/styles";

export const getTheme = (darkMode) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#1976d2" },
      secondary: { main: "#dc004e" },
      background: { default: darkMode ? "#121212" : "#ffffff", paper: darkMode ? "#1e1e1e" : "#f5f5f5" },
      text: { primary: darkMode ? "#ffffff" : "#000000" }
    }
  });
