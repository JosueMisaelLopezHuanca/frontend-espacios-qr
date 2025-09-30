import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

import MacrodistritoPage from "../features/macrodistritos/pages/MacrodistritoPage";
import ZonaPage from "../features/zonas/pages/ZonaPage";
import AreadeportivaPage from "../features/areadeportiva/pages/AreadeportivaPage";
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
        
        {/* Ruta para Zonas */}
        <Route
          path="/zonas"
          element={
            <DashboardLayout>
              <ZonaPage /> 
            </DashboardLayout>
          }
        />

        {/* Ruta para Áreas Deportivas */}
        <Route
          path="/areadeportiva"
          element={
            <DashboardLayout>
              <AreadeportivaPage /> 
            </DashboardLayout>
          }
        />

        <Route
          path="/reservas"
          element={
            <DashboardLayout>
              <ReservaPage />
            </DashboardLayout>
          }
        />

        <Route
          path="/reservas/:id/qrs"
          element={
            <DashboardLayout>
              <QrPage />
            </DashboardLayout>
          }
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
