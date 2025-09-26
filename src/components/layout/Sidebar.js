import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-logo">LOGUITO</h2>
      <nav>
        <ul>
          <li><Link to="/macrodistritos">Macrodistritos</Link></li>
          <li><Link to="/usuarios">Usuarios</Link></li>
          <li><Link to="/reservas">Reservas</Link></li>
          <li><Link to="/reportes">Reportes</Link></li>
          <li><Link to="/configuracion">Configuración</Link></li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
