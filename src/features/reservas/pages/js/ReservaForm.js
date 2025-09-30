import React, { useEffect, useState } from "react";
import "../css/reservaForm.css";

export default function ReservaForm({ initialData, onSave, onCancel }) {
  const [fechaCreacion, setFechaCreacion] = useState("");
  const [fechaReserva, setFechaReserva] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [estadoReserva, setEstadoReserva] = useState("Activa");
  const [montoTotal, setMontoTotal] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFechaCreacion(initialData.fechaCreacion || "");
      setFechaReserva(initialData.fechaReserva || "");
      setHoraInicio(initialData.horaInicio || "");
      setHoraFin(initialData.horaFin || "");
      setEstadoReserva(initialData.estadoReserva || "Activa");
      setMontoTotal(initialData.montoTotal?.toString() || "");
      setObservaciones(initialData.observaciones || ""); // ← editable ahora
      setClienteId(initialData.clienteId?.toString() || "");
    } else {
      const hoy = new Date().toISOString().split("T")[0];
      setFechaCreacion(hoy);
      setFechaReserva("");
      setHoraInicio("");
      setHoraFin("");
      setEstadoReserva("Activa");
      setMontoTotal("");
      setObservaciones("");
      setClienteId("");
    }
    setErrors({});
  }, [initialData]);

  function validate() {
    const e = {};
    if (!fechaCreacion) e.fechaCreacion = "Fecha de creación requerida";
    if (!fechaReserva) e.fechaReserva = "Fecha de reserva requerida";
    if (!horaInicio) e.horaInicio = "Hora de inicio requerida";
    if (!horaFin) e.horaFin = "Hora de fin requerida";
    if (!estadoReserva) e.estadoReserva = "Estado requerido";
    if (!montoTotal || isNaN(parseFloat(montoTotal))) e.montoTotal = "Monto válido requerido";
    if (!clienteId) e.clienteId = "Cliente requerido";
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    const payload = {
      ...(initialData?.idReserva ? { idReserva: initialData.idReserva } : {}),
      fechaCreacion,
      fechaReserva,
      horaInicio,
      horaFin,
      estadoReserva,
      montoTotal: parseFloat(montoTotal),
      observaciones,
      clienteId: parseInt(clienteId)
    };

    onSave(payload);
  }

  return (
    <form className="reserva-form" onSubmit={handleSubmit}>
      <h3>{initialData ? "Editar Reserva" : "Nueva Reserva"}</h3>

      <div className="form-row">
        <label>Fecha de creación</label>
        <input type="date" value={fechaCreacion} onChange={e => setFechaCreacion(e.target.value)} />
        {errors.fechaCreacion && <div className="form-error">{errors.fechaCreacion}</div>}
      </div>

      <div className="form-row">
        <label>Fecha de reserva</label>
        <input type="date" value={fechaReserva} onChange={e => setFechaReserva(e.target.value)} />
        {errors.fechaReserva && <div className="form-error">{errors.fechaReserva}</div>}
      </div>

      <div className="form-row">
        <label>Hora inicio</label>
        <input type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} />
        {errors.horaInicio && <div className="form-error">{errors.horaInicio}</div>}
      </div>

      <div className="form-row">
        <label>Hora fin</label>
        <input type="time" value={horaFin} onChange={e => setHoraFin(e.target.value)} />
        {errors.horaFin && <div className="form-error">{errors.horaFin}</div>}
      </div>

      <div className="form-row">
        <label>Estado</label>
        <select value={estadoReserva} onChange={e => setEstadoReserva(e.target.value)}>
          <option value="Activa">Activa</option>
          <option value="Inactiva">Inactiva</option>
          <option value="Cancelada">Cancelada</option>
        </select>
        {errors.estadoReserva && <div className="form-error">{errors.estadoReserva}</div>}
      </div>

      <div className="form-row">
        <label>Monto total</label>
        <input type="number" step="0.01" value={montoTotal} onChange={e => setMontoTotal(e.target.value)} />
        {errors.montoTotal && <div className="form-error">{errors.montoTotal}</div>}
      </div>

      <div className="form-row">
        <label>Observaciones</label>
        <textarea value={observaciones} onChange={e => setObservaciones(e.target.value)} rows={3} />
      </div>

      <div className="form-row">
        <label>ID Cliente</label>
        <input type="number" value={clienteId} onChange={e => setClienteId(e.target.value)} />
        {errors.clienteId && <div className="form-error">{errors.clienteId}</div>}
      </div>

      <div className="form-actions">
        <button type="submit">Guardar</button>
        <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
