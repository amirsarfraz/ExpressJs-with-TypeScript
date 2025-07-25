import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Auth/Register.tsx";
import Login from "./components/Auth/Login.tsx";
import "./index.css"; // ✅ Import Tailwind CSS here
import UserTable from "./components/Dashboard/UserTable.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<UserTable />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
