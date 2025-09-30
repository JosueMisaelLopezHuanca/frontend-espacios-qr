// src/components/layout/Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom"; // <- usa NavLink para active
import {
  TfiLayoutSidebarLeft,
  TfiMapAlt,
  TfiLocationPin,
  TfiBasketball,
  TfiLayersAlt,
} from "react-icons/tfi";
import "../../styles/Sidebar.css";

function Sidebar({ open }) {
  const menuItems = [
    { label: "Macrodistritos", icon: <TfiLayoutSidebarLeft />, path: "/macrodistritos" },
    { label: "Zonas", icon: <TfiMapAlt />, path: "/zonas" },
    { label: "Áreas Deportivas", icon: <TfiLocationPin />, path: "/areadeportiva" },
    { label: "Canchas", icon: <TfiBasketball />, path: "/canchas" },
    { label: "Equipamientos", icon: <TfiLayersAlt />, path: "/equipamientos" },
    { label: "Reservas", icon: <TfiLayersAlt />, path: "/reservas" },

  ];

  return (
    <aside className={`sidebar ${open ? "expanded" : "collapsed"}`}>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
