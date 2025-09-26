import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

import MacrodistritoPage from "../features/macrodistritos/pages/MacrodistritoPage";
//import UsuarioPage from "../features/usuarios/pages/UsuarioPage";
//import ReservaPage from "../features/reservas/pages/ReservaPage";
//import ReportePage from "../features/reportes/pages/ReportePage";
//import ConfiguracionPage from "../features/configuracion/pages/ConfiguracionPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/macrodistritos" replace />} />
        
        <Route
          path="/macrodistritos"
          element={
            <DashboardLayout>
              <MacrodistritoPage />
            </DashboardLayout>
          }
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
