import React, { useEffect, useState } from "react";
import "../css/qrForm.css";

export default function QrForm({ initialData, onSave, onCancel }) {
  const [codigoQr, setCodigoQr] = useState("");
  const [fechaGeneracion, setFechaGeneracion] = useState("");
  const [fechaExpiracion, setFechaExpiracion] = useState("");
  const [estado, setEstado] = useState(true);
  const [descripcion, setDescripcion] = useState("");
  const [idUsControl, setIdUsControl] = useState("");
  const [idInvitado, setIdInvitado] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setCodigoQr(initialData.codigoQr || "");
      setFechaGeneracion(initialData.fechaGeneracion?.slice(0, 16) || "");
      setFechaExpiracion(initialData.fechaExpiracion?.slice(0, 16) || "");
      setEstado(initialData.estado ?? true);
      setDescripcion(initialData.descripcion || "");
      setIdUsControl(initialData.usuarioControl?.idPersona?.toString() || "");
      setIdInvitado(initialData.invitado?.idPersona?.toString() || "");
    } else {
      setCodigoQr("");
      setFechaGeneracion("");
      setFechaExpiracion("");
      setEstado(true);
      setDescripcion("");
      setIdUsControl("");
      setIdInvitado("");
    }
    setErrors({});
  }, [initialData]);

  function validate() {
    const e = {};
    if (!codigoQr.trim()) e.codigoQr = "Código QR requerido";
    if (!fechaGeneracion) e.fechaGeneracion = "Fecha de generación requerida";
    if (!fechaExpiracion) e.fechaExpiracion = "Fecha de expiración requerida";
    if (!idUsControl) e.idUsControl = "ID de control requerido";
    if (!idInvitado) e.idInvitado = "ID de invitado requerido";
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
      ...(initialData?.idQr ? { idQr: initialData.idQr } : {}),
      codigoQr: codigoQr.trim(),
      fechaGeneracion,
      fechaExpiracion,
      estado,
      descripcion,
      usuarioControl: { idPersona: parseInt(idUsControl) },
      invitado: { idPersona: parseInt(idInvitado) }
    };

    onSave(payload);
  }

  return (
    <form className="qr-form" onSubmit={handleSubmit}>
      <h3>{initialData ? "Editar QR" : "Nuevo QR"}</h3>

      <div className="form-row">
        <label>Código QR</label>
        <input value={codigoQr} onChange={e => setCodigoQr(e.target.value)} />
        {errors.codigoQr && <div className="form-error">{errors.codigoQr}</div>}
      </div>

      <div className="form-row">
        <label>Fecha de generación</label>
        <input type="datetime-local" value={fechaGeneracion} onChange={e => setFechaGeneracion(e.target.value)} />
        {errors.fechaGeneracion && <div className="form-error">{errors.fechaGeneracion}</div>}
      </div>

      <div className="form-row">
        <label>Fecha de expiración</label>
        <input type="datetime-local" value={fechaExpiracion} onChange={e => setFechaExpiracion(e.target.value)} />
        {errors.fechaExpiracion && <div className="form-error">{errors.fechaExpiracion}</div>}
      </div>

      <div className="form-row">
        <label>Estado</label>
        <label className="checkbox-label">
          <input type="checkbox" checked={estado} onChange={e => setEstado(e.target.checked)} />
          Activo
        </label>
      </div>

      <div className="form-row">
        <label>Descripción</label>
        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={3} />
      </div>

      <div className="form-row">
        <label>ID Usuario Control</label>
        <input type="number" value={idUsControl} onChange={e => setIdUsControl(e.target.value)} />
        {errors.idUsControl && <div className="form-error">{errors.idUsControl}</div>}
      </div>

      <div className="form-row">
        <label>ID Invitado</label>
        <input type="number" value={idInvitado} onChange={e => setIdInvitado(e.target.value)} />
        {errors.idInvitado && <div className="form-error">{errors.idInvitado}</div>}
      </div>

      <div className="form-actions">
        <button type="submit">Guardar</button>
        <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
