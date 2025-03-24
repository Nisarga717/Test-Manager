# Test Manager App

A modern web-based tool for managing test cases and test suites. This application helps QA teams organize, execute, and track tests effectively. With a clean, responsive UI built on React, Redux, and Material-UI, it features CRUD operations, search, filtering, sorting, pagination, user assignment, dark mode, and notifications.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Test Case Management**
  - Display a list of test cases with:
    - Title
    - Description
    - Execution Status (Pending, In Progress, Passed, Failed)
    - Priority (Low, Medium, High)
    - Associated Test Suite
    - Assigned User
  - CRUD operations for test cases.
  - Pagination, search, filtering, and sorting for efficient navigation.
  - Pop-up notifications (using Material-UI Snackbar) for add, update, and delete actions.

- **Test Suite Management**
  - Display a list of test suites.
  - CRUD operations for test suites.
  - Search functionality.
  - Forms for adding and editing test suites via Material-UI Dialogs.

- **User Assignment**
  - Assign test cases to users using a dropdown in the form.
  - Display assigned user names in the test case list.

- **Dark Mode**
  - Toggle between light and dark themes using Material-UI theme customization.
  - Dark mode state is persisted via `localStorage`.

- **Notifications**
  - Success and error pop-ups using Material-UI Snackbar to provide user feedback.

---

## Technologies Used

- **React.js** (with functional components and hooks)
- **Redux** (for state management)
- **Redux Thunk** (for asynchronous actions)
- **Material-UI (MUI)** (for modern, responsive UI components)
- **React Router** (for client-side routing)
- **json-server** (to simulate a backend API)
- **Recharts** (for charts, if needed)
- **Lucide-react** (for icons)
- **redux-devtools-extension** (for debugging Redux)

---

## Requirements

Before running the project, ensure you have installed:
- **Node.js** (v14 or later)
- **npm** (v6 or later)

The following npm packages will be installed via `npm install`:
- react, react-dom, react-router-dom
- redux, react-redux, redux-thunk
- @mui/material, @mui/icons-material, @emotion/react, @emotion/styled
- recharts, lucide-react
- json-server
- redux-devtools-extension (optional, for debugging)

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/test-manager.git
   cd test-manager

2. **Install dependencies:**

   ```bash
   npm install

3. **Set up the Mock API:**

  Make sure you have json-server installed globally (or install it locally):
   ```bash
  npm install -g json-server



