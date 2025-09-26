import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
