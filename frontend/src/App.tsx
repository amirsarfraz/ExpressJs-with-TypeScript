import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/Auth/Register.tsx";
import Login from "./components/Auth/Login.tsx";
import "./index.css";
import UserTable from "./components/Dashboard/UserTable.tsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<UserTable />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
