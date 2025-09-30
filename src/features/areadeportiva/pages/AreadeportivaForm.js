// src/features/areadeportivas/pages/AreadeportivaForm.jsx
import React, { useEffect, useState } from "react";
import './Areadeportiva.css';

export default function AreadeportivaForm({ initialData, onSave, onCancel }) {
  // Campos principales
  const [nombreArea, setNombreArea] = useState('');
  const [descripcionArea, setDescripcionArea] = useState('');
  const [emailArea, setEmailArea] = useState('');
  const [telefonoArea, setTelefonoArea] = useState('');
  const [horaInicioArea, setHoraInicioArea] = useState('');
  const [horaFinArea, setHoraFinArea] = useState('');
  const [estado, setEstado] = useState(true);
  const [urlImagen, setUrlImagen] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  // Llaves foráneas
  const [idZona, setIdZona] = useState(null);
  const [idAdministrador, setIdAdministrador] = useState(null);

  const [zonas, setZonas] = useState([]); // Lista de zonas para select
  const [administradores, setAdministradores] = useState([]); // Lista de administradores
  const [errors, setErrors] = useState({});

  // Cargar zonas y administradores al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        const zonasRes = await fetch('http://localhost:8032/api/zonas');
        const zonasData = await zonasRes.json();
        setZonas(Array.isArray(zonasData) ? zonasData : []);

        const adminsRes = await fetch('http://localhost:8032/api/administradores');
        const adminsData = await adminsRes.json();
        setAdministradores(Array.isArray(adminsData) ? adminsData : []);
      } catch (err) {
        console.error("Error cargando zonas o administradores:", err);
        setZonas([]);
        setAdministradores([]);
      }
    };
    loadData();
  }, []);

  // Cargar datos iniciales (editar)
  useEffect(() => {
    if (initialData) {
      setNombreArea(initialData.nombreArea || '');
      setDescripcionArea(initialData.descripcionArea || '');
      setEmailArea(initialData.emailArea || '');
      setTelefonoArea(initialData.telefonoArea || '');
      setHoraInicioArea(initialData.horaInicioArea || '');
      setHoraFinArea(initialData.horaFinArea || '');
      setEstado(initialData.estado ?? true);
      setUrlImagen(initialData.urlImagen || '');
      setLatitud(initialData.latitud ?? '');
      setLongitud(initialData.longitud ?? '');
      setIdZona(initialData.idZona ?? null);
      setIdAdministrador(initialData.idAdministrador ?? null);
    } else {
      setNombreArea('');
      setDescripcionArea('');
      setEmailArea('');
      setTelefonoArea('');
      setHoraInicioArea('');
      setHoraFinArea('');
      setEstado(true);
      setUrlImagen('');
      setLatitud('');
      setLongitud('');
      setIdZona(null);
      setIdAdministrador(null);
    }
    setErrors({});
  }, [initialData]);

  // Validación del formulario
  const validate = () => {
    const e = {};
    if (!nombreArea.trim()) e.nombreArea = "El nombre del área es obligatorio";
    if (!idZona) e.idZona = "Debe seleccionar una zona";
    if (!idAdministrador) e.idAdministrador = "Debe seleccionar un administrador";
    if (!latitud) e.latitud = "Latitud es obligatoria";
    if (!longitud) e.longitud = "Longitud es obligatoria";
    if (!horaInicioArea) e.horaInicioArea = "Hora de inicio obligatoria";
    if (!horaFinArea) e.horaFinArea = "Hora de fin obligatoria";
    return e;
  };
//ENVIO FORMULARIO
  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
//REVISO
    const payload = {
      ...(initialData?.idAreadeportiva ? { idAreadeportiva: initialData.idAreadeportiva } : {}),
      nombreArea: nombreArea.trim(),
      descripcionArea: descripcionArea.trim(),
      emailArea: emailArea.trim(),
      telefonoArea: telefonoArea.trim(),
      horaInicioArea: horaInicioArea,
      horaFinArea: horaFinArea,
      estado: estado,
      urlImagen: urlImagen.trim(),
      latitud: Number(latitud),
      longitud: Number(longitud),
      idZona: Number(idZona),
      idAdministrador: Number(idAdministrador)
    };

    onSave(payload);
  };

  return (
    <form className="Areadeportiva-form" onSubmit={handleSubmit}>
      <h3>{initialData ? "Editar Área Deportiva" : "Nueva Área Deportiva"}</h3>

      <div className="form-row">
        <label>Nombre del Área</label>
        <input value={nombreArea} onChange={e => setNombreArea(e.target.value)} />
        {errors.nombreArea && <div className="form-error">{errors.nombreArea}</div>}
      </div>

      <div className="form-row">
        <label>Descripción</label>
        <textarea value={descripcionArea} onChange={e => setDescripcionArea(e.target.value)} />
      </div>

      <div className="form-row">
        <label>Email</label>
        <input type="email" value={emailArea} onChange={e => setEmailArea(e.target.value)} />
      </div>

      <div className="form-row">
        <label>Teléfono</label>
        <input value={telefonoArea} onChange={e => setTelefonoArea(e.target.value)} placeholder="8 dígitos" />
      </div>

      <div className="form-row">
        <label>Hora Inicio</label>
        <input type="time" value={horaInicioArea} onChange={e => setHoraInicioArea(e.target.value)} />
        {errors.horaInicioArea && <div className="form-error">{errors.horaInicioArea}</div>}
      </div>

      <div className="form-row">
        <label>Hora Fin</label>
        <input type="time" value={horaFinArea} onChange={e => setHoraFinArea(e.target.value)} />
        {errors.horaFinArea && <div className="form-error">{errors.horaFinArea}</div>}
      </div>

      <div className="form-row">
        <label>Latitud</label>
        <input type="number" step="any" value={latitud} onChange={e => setLatitud(e.target.value)} />
        {errors.latitud && <div className="form-error">{errors.latitud}</div>}
      </div>

      <div className="form-row">
        <label>Longitud</label>
        <input type="number" step="any" value={longitud} onChange={e => setLongitud(e.target.value)} />
        {errors.longitud && <div className="form-error">{errors.longitud}</div>}
      </div>

      <div className="form-row">
        <label>Url</label>
        <input type="string" step="any" value={urlImagen} onChange={e => setUrlImagen(e.target.value)} />
        {errors.urlImagen && <div className="form-error">{errors.urlImagen}</div>}
      </div>

      <div className="form-row">
        <label>Zona</label>
        <select value={idZona ?? ''} onChange={e => setIdZona(Number(e.target.value))}>
          <option value="">Seleccione una zona</option>
          {zonas.map(z => (
            <option key={z.idZona} value={z.idZona}>{z.nombre}</option>
          ))}
        </select>
        {errors.idZona && <div className="form-error">{errors.idZona}</div>}
      </div>

      <div className="form-row">
        <label>Administrador</label>
        <select value={idAdministrador ?? ''} onChange={e => setIdAdministrador(Number(e.target.value))}>
          <option value="">Seleccione un administrador</option>
          {administradores.map(a => (
            <option key={a.idAdministrador} value={a.idAdministrador}>{a.nombre}</option>
          ))}
        </select>
        {errors.idAdministrador && <div className="form-error">{errors.idAdministrador}</div>}
      </div>

      <div className="form-row">
        <label className="checkbox-label">
          <input type="checkbox" checked={estado} onChange={e => setEstado(e.target.checked)} /> Activo
        </label>
      </div>

      <div className="form-actions">
        <button type="submit">Guardar</button>
        <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
