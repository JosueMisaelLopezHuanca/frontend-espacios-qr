import React, { useEffect, useState } from "react";
import MacrodistritoForm from "../pages/MacrodistritoForm";
import * as macrodistritoService from "../../../api/macrodistritoApi";
// src/features/macrodistritos/pages/MacrodistritoPage.jsx

import "../pages/macrodistritoPage.css"; // Importar CSS de la página

export default function MacrodistritoPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await macrodistritoService.getMacrodistritos();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("No se pudieron cargar los macrodistritos");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e && e.preventDefault();

    if (!search.trim()) {
      load();
      return;
    }

    const filtered = items.filter(item =>
      item.nombre?.toLowerCase().includes(search.trim().toLowerCase())
    );
    setItems(filtered);
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
    if (!id) return;

    if (!window.confirm("¿Desactivar este macrodistrito?")) return;

    try {
      const itemToUpdate = items.find(x => x.idMacrodistrito === id);
      if (!itemToUpdate) return;

      const updated = {
        ...itemToUpdate,
        estado: false,
      };

      await macrodistritoService.updateMacrodistrito(id, updated);

      setItems(prev =>
        prev.map(x =>
          x.idMacrodistrito === id ? { ...x, estado: false } : x
        )
      );
    } catch (err) {
      alert("No se pudo desactivar");
    }
  }

  async function handleSave(payload) {
    try {
      const dataToSend =
        editing && editing.idMacrodistrito
          ? { ...editing, ...payload, idMacrodistrito: editing.idMacrodistrito }
          : payload;

      if (dataToSend.idMacrodistrito) {
        const updated = await macrodistritoService.updateMacrodistrito(
          dataToSend.idMacrodistrito,
          dataToSend
        );
        setItems(prev =>
          prev.map(p =>
            p.idMacrodistrito === updated.idMacrodistrito ? updated : p
          )
        );
      } else {
        const created = await macrodistritoService.createMacrodistrito(dataToSend);
        setItems(prev => [created, ...prev]);
      }

      setShowForm(false);
      setEditing(null);
    } catch (err) {
      alert("Error guardando macrodistrito");
    }
  }

  return (
    <div className="macrodistrito-page card">
      <div className="page-header">
        <h2>Macrodistritos</h2>

        <div className="search-actions-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              className="search-input"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </form>
          <div className="button-group">
            <button className="btn btn-secondary" onClick={handleSearch}>Buscar</button>
            <button
              type="button"
              className="btn btn-accent"
              onClick={() => {
                setSearch("");
                load();
              }}
            >
              Limpiar
            </button>
            <button className="btn btn-primary" onClick={openCreate}>
              Nuevo macrodistrito
            </button>
          </div>
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
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Sin datos
                  </td>
                </tr>
              ) : (
                items.map(item => (
                  <tr
                    key={item.idMacrodistrito}
                    className={!item.estado ? "row-inactive" : ""}
                  >
                    <td>{item.idMacrodistrito}</td>
                    <td>{item.nombre}</td>
                    <td>{item.descripcion}</td>
                    <td>{item.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary" onClick={() => openEdit(item)}>
                          Editar
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(item.idMacrodistrito)}
                        >
                          Desactivar
                        </button>
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
            <MacrodistritoForm
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
