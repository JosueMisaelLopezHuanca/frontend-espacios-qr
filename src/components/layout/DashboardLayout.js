// src/components/layout/DashboardLayout.js
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../../styles/Sidebar.css";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
      <Sidebar open={sidebarOpen} />
      <div className={`dashboard-main ${sidebarOpen ? "expanded" : "collapsed"}`}>


        <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
