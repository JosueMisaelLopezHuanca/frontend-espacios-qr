import React from "react";
import { TfiAlignLeft, TfiAlignRight } from "react-icons/tfi";
import "../../styles/Navbar.css";

function Navbar({ toggleSidebar, sidebarOpen }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Botón que cambia de ícono */}
        <button className="toggle-btn" onClick={toggleSidebar}>
          {sidebarOpen ? <TfiAlignRight /> : <TfiAlignLeft />}
        </button>
      </div>
      {/* Ícono vectorizado personalizado */}
      <img src="/logo.svg" alt="Logo" className="navbar-logo" />
      <div className="navbar-icons">
        <span>🔔</span>
        <span>⚙️</span>
        <span>👤</span>
      </div>
    </header>
  );
}

export default Navbar;
