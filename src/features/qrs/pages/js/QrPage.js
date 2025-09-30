import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QrForm from "./QrForm";
import "../css/qrPage.css";
import * as qrService from "../../../../api/qrApi";

export default function QrPage() {
  const { id } = useParams(); // idReserva
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await qrService.getQRsByReserva(id);
      setQrs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando QRs", err);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(qr) {
    setEditing(qr);
    setShowForm(true);
  }

  async function handleDelete(idQr) {
    if (!window.confirm("¿Eliminar este QR?")) return;
    try {
      await qrService.deleteQR(idQr);
      setQrs(prev => prev.filter(q => q.idQr !== idQr));
    } catch (err) {
      alert("No se pudo eliminar");
    }
  }

  async function handleSave(payload) {
    try {
      const dataToSend = {
        ...payload,
        reserva: { idReserva: parseInt(id) },
      };

      if (editing?.idQr) {
        const updated = await qrService.updateQR(editing.idQr, dataToSend);
        setQrs(prev =>
          prev.map(q => (q.idQr === updated.idQr ? updated : q))
        );
      } else {
        const created = await qrService.createQR(dataToSend);
        setQrs(prev => [created, ...prev]);
      }

      setShowForm(false);
      setEditing(null);
    } catch (err) {
      alert("Error guardando QR");
    }
  }

  return (
    <div className="qr-page">
      <div className="qr-header">
        <h2>QRs de la reserva #{id}</h2>
        <button className="btn btn-primary" onClick={openCreate}>Nuevo QR</button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="qr-grid">
          {qrs.length === 0 ? (
            <p>No hay QRs para esta reserva</p>
          ) : (
            qrs.map(qr => (
              <div key={qr.idQr} className="qr-card">
                <h4>{qr.codigoQr}</h4>
                <p><strong>Descripción:</strong> {qr.descripcion}</p>
                <p><strong>Generado:</strong> {qr.fechaGeneracion}</p>
                <p><strong>Expira:</strong> {qr.fechaExpiracion}</p>
                <p><strong>Estado:</strong> {qr.estado ? "Activo" : "Inactivo"}</p>
                {/*<p><strong>Control:</strong> {qr.usuarioControl?.nombre || qr.usuarioControl?.idPersona}</p>
                <p><strong>Invitado:</strong> {qr.invitado?.nombre || qr.invitado?.idPersona}</p>
                <p><strong>Cliente:</strong> {qr.reserva?.cliente?.nombre || qr.reserva?.clienteId}</p> */}
                <div className="qr-actions">
                  <button className="btn btn-secondary" onClick={() => openEdit(qr)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(qr.idQr)}>Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <QrForm
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
