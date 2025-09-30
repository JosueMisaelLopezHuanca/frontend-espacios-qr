import React, { useEffect, useState } from "react";
import ReservaForm from "./ReservaForm";
import * as reservaService from "../../../../api/reservaApi";
import "../css/reservaPage.css";
import { useNavigate } from "react-router-dom";

export default function ReservaPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await reservaService.getReservas();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando reservas", err);
      setError("No se pudieron cargar las reservas");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(item) {
    setEditing(item);
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Desactivar esta reserva?")) return;
    try {
      const item = items.find(x => x.idReserva === id);
      const updated = {
        idReserva: item.idReserva,
        fechaCreacion: item.fechaCreacion,
        fechaReserva: item.fechaReserva,
        horaInicio: item.horaInicio,
        horaFin: item.horaFin,
        estadoReserva: "Inactiva",
        montoTotal: item.montoTotal,
        observaciones: item.observaciones,
        clienteId: item.clienteId || item.cliente?.idPersona
      };
      await reservaService.updateReserva(id, updated);
      setItems(prev =>
        prev.map(x =>
          x.idReserva === id ? { ...x, estadoReserva: "Inactiva" } : x
        )
      );
    } catch (err) {
      console.error("Error al desactivar reserva:", err);
      alert("No se pudo desactivar");
    }
  }

  async function handleSave(payload) {
    try {
      const dataToSend = {
        idReserva: editing?.idReserva,
        fechaCreacion: payload.fechaCreacion,
        fechaReserva: payload.fechaReserva,
        horaInicio: payload.horaInicio,
        horaFin: payload.horaFin,
        estadoReserva: payload.estadoReserva,
        montoTotal: payload.montoTotal,
        observaciones: payload.observaciones,
        clienteId: payload.clienteId
      };

      if (editing?.idReserva) {
        const updated = await reservaService.updateReserva(editing.idReserva, dataToSend);
        setItems(prev =>
          prev.map(p =>
            p.idReserva === updated.idReserva ? updated : p
          )
        );
      } else {
        const created = await reservaService.createReserva(dataToSend);
        setItems(prev => [created, ...prev]);
      }
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error("Error guardando reserva:", err);
      alert("Error guardando reserva");
    }
  }

  function handleViewQR(item) {
    navigate(`/reservas/${item.idReserva}/qrs`);
  }

  return (
    <div className="reserva-page card">
      <div className="page-header">
        <h2>Reservas</h2>
        <div className="button-group">
          <button className="btn btn-primary" onClick={openCreate}>Nueva reserva</button>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="table-wrap">
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Creación</th>
                <th>Reserva</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
                <th>Monto</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center" }}>Sin datos</td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item.idReserva}>
                    <td>{item.idReserva}</td>
                    <td>{item.cliente?.nombre || item.clienteId}</td>
                    <td>{item.fechaCreacion}</td>
                    <td>{item.fechaReserva}</td>
                    <td>{item.horaInicio}</td>
                    <td>{item.horaFin}</td>
                    <td>{item.estadoReserva}</td>
                    <td>{item.montoTotal}</td>
                    <td>{item.observaciones}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary" onClick={() => openEdit(item)}>Editar</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(item.idReserva)}>Desactivar</button>
                        <button className="btn btn-accent" onClick={() => handleViewQR(item)}>Ver QRs</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <ReservaForm
              initialData={editing}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
}
