import React, { useEffect, useState } from "react";
import ZonaForm from "../pages/ZonaForm";
import * as ZonaService from "../../../api/ZonaApi";


import "../pages/ZonaPage.css"; // Importar CSS de la página


export default function ZonaPage() {
  const [items, setItems] = useState([]); //listadito de zonas
  const [loading, setLoading] = useState(false);//Indica si los datos están siendo cargados desde la API.
  const [error, setError] = useState(null); //Guarda cualquier mensaje de error que ocurra al hacer una solicitud.
  const [showForm, setShowForm] = useState(false); //Controla si se muestra el formulario para crear o editar una zona.
  const [editing, setEditing] = useState(null); //Guarda la zona que se está editando. Si es
  const [search, setSearch] = useState("");//El valor del campo de búsqueda para filtrar las zonas por nombre.

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await ZonaService.getZonas(); // Llama a la función para obtener las zonas
      setItems(Array.isArray(data) ? data : []); // Guarda las zonas en el estado
    } catch (err) {
      setError("No se pudieron cargar los Zonas"); // Si hay un error, muestra el mensaje
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  }


  async function handleSearch(e) {
    e && e.preventDefault(); // Previene el comportamiento por defecto del formulario

    if (!search.trim()) {
      load(); // Si no hay búsqueda, recarga todas las zonas
      return;
    }

    const filtered = items.filter(item =>
      item.nombre?.toLowerCase().includes(search.trim().toLowerCase()) // Filtra las zonas por nombre
    );
    setItems(filtered); // Actualiza el estado con las zonas filtradas
  }


  function openCreate() {
    setEditing(null); // No hay zona en edición
    setShowForm(true); // Muestra el formulario de creación
  }

  function openEdit(item) {
    setEditing(item); // Establece la zona a editar
    setShowForm(true); // Muestra el formulario de edición
  }

  async function handleDelete(id) {
    if (!id) return;

    if (!window.confirm("¿Desactivar este Zona?")) return;

    try {
      const itemToUpdate = items.find(x => x.idZona === id);
      if (!itemToUpdate) return;

      const updated = {
        ...itemToUpdate,
        estado: false,
      };

      await ZonaService.updateZona(id, updated);

      setItems(prev =>
        prev.map(x =>
          x.idZona === id ? { ...x, estado: false } : x
        )
      );
    } catch (err) {
      alert("No se pudo desactivar");
    }
  }

async function handleSave(payload) {
  try {
    // Depuración: Verificar los datos que se envían
    console.log("Payload a enviar:", payload);

    const dataToSend =
      editing && editing.idZona
        ? { ...editing, ...payload, idZona: editing.idZona } // Si estamos editando, actualizamos los datos
        : payload; // Si estamos creando, usamos los datos del formulario

    // Verificar que el payload tiene la propiedad idMacrodistrito
    if (!dataToSend.idMacrodistrito) {
      console.error("Falta el idMacrodistrito en el payload");
      return;
    }

    if (dataToSend.idZona) {
      const updated = await ZonaService.updateZona(dataToSend.idZona, dataToSend); // Actualiza la zona
      setItems(prev =>
        prev.map(p => p.idZona === updated.idZona ? updated : p) // Actualiza la zona en el estado
      );
    } else {
      const created = await ZonaService.createZona(dataToSend); // Crea la nueva zona
      setItems(prev => [created, ...prev]); // Agrega la nueva zona al principio de la lista
    }

    setShowForm(false); // Cierra el formulario
    setEditing(null); // Resetea el estado de edición
  } catch (err) {
    console.error("Error guardando zona:", err);
    alert("Error guardando Zona");
  }
}



  return (
    <div className="Zona-page card">
      <div className="page-header">
        <h2>Zonas</h2>

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
              Nuevo Zona
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
                    key={item.idZona}
                    className={!item.estado ? "row-inactive" : ""}
                  >
                    <td>{item.idZona}</td>
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
                          onClick={() => handleDelete(item.idZona)}
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
            <ZonaForm
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
