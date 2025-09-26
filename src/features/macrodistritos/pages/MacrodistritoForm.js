// src/features/macrodistritos/components/MacrodistritoForm.jsx
import React, { useEffect, useState } from 'react';
import './macrodistritoForm.css';

export default function MacrodistritoForm({ initialData, onSave, onCancel }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || '');
      setDescripcion(initialData.descripcion || '');
      setEstado(initialData.estado ?? true);
    } else {
      setNombre('');
      setDescripcion('');
      setEstado(true);
    }
    setErrors({});
  }, [initialData]);

  function validate() {
    const e = {};
    if (!nombre.trim()) e.nombre = 'Nombre es requerido';
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
      ...(initialData?.idMacrodistrito ? { idMacrodistrito: initialData.idMacrodistrito } : {}),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      estado
    };
    onSave(payload);
  }

  return (
    <form className="macrodistrito-form" onSubmit={handleSubmit}>
      <h3>{initialData ? 'Editar Macrodistrito' : 'Nuevo Macrodistrito'}</h3>

      <div className="form-row">
        <label>Nombre</label>
        <input value={nombre} onChange={e => setNombre(e.target.value)} />
        {errors.nombre && <div className="form-error">{errors.nombre}</div>}
      </div>

      <div className="form-row">
        <label>Descripción</label>
        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} />
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
