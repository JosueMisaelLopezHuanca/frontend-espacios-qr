import React, { useEffect, useState } from "react";
import AreadeportivaForm from "../pages/AreadeportivaForm";
import * as AreadeportivaService from "../../../api/AreadeportivaApi";


//import "../pages/AreadeportivaPage.css"; // Importar CSS de la página


export default function AreadeportivaPage() {
  const [items, setItems] = useState([]); //listadito de Areadeportivas
  const [loading, setLoading] = useState(false);//Indica si los datos están siendo cargados desde la API.
  const [error, setError] = useState(null); //Guarda cualquier mensaje de error que ocurra al hacer una solicitud.
  const [showForm, setShowForm] = useState(false); //Controla si se muestra el formulario para crear o editar una Areadeportiva.
  const [editing, setEditing] = useState(null); //Guarda la Areadeportiva que se está editando. Si es
  const [search, setSearch] = useState("");//El valor del campo de búsqueda para filtrar las Areadeportivas por nombre.

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await AreadeportivaService.getAreadeportiva(); // Llama a la función para obtener las Areadeportivas
      setItems(Array.isArray(data) ? data : []); // Guarda las Areadeportivas en el estado
    } catch (err) {
      setError("No se pudieron cargar los Areadeportivas"); // Si hay un error, muestra el mensaje
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  }

  async function handleSearch(e) {
    e && e.preventDefault(); // Previene el comportamiento por defecto del formulario

    if (!search.trim()) {
      load(); // Si no hay búsqueda, recarga todas las Areadeportivas
      return;
    }

    const filtered = items.filter(item =>
      item.nombreArea?.toLowerCase().includes(search.trim().toLowerCase()) // Filtra las Areadeportivas por nombre
    );
    setItems(filtered); // Actualiza el estado con las Areadeportivas filtradas
  }

  function openCreate() {
    setEditing(null); // No hay Areadeportiva en edición
    setShowForm(true); // Muestra el formulario de creación
  }

  function openEdit(item) {
    setEditing(item); // Establece la Areadeportiva a editar
    setShowForm(true); // Muestra el formulario de edición
  }

  


  function handleViewDetail(item) {
    alert(`
      Nombre: ${item.nombreArea}
      Descripción: ${item.descripcionArea}
      Email: ${item.emailArea}
      Teléfono: ${item.telefonoArea}
      Horario: ${item.horaInicioArea} - ${item.horaFinArea}
      Estado: ${item.estadoArea ? "Activo" : "Inactivo"}
    `);
  }

  async function handleDelete(id) {
    if (!id) return;

    if (!window.confirm("¿Desactivar este Areadeportiva?")) return;

    try {
      const itemToUpdate = items.find(x => x.idAreadeportiva === id);
      if (!itemToUpdate) return;

      const updated = {
        ...itemToUpdate,
        estado: false,
      };

      await AreadeportivaService.updateAreadeportiva(id, updated);

      setItems(prev =>
        prev.map(x =>
          x.idAreadeportiva === id ? { ...x, estado: false } : x
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
      editing && editing.idAreadeportiva
        ? { ...editing, ...payload, idAreadeportiva: editing.idAreadeportiva } // Si estamos editando, actualizamos los datos
        : payload; // Si estamos creando, usamos los datos del formulario

    // Verificar que el payload tiene la propiedad idZona
    if (!dataToSend.idZona) {
      console.error("Falta el idZona en el payload");
      return;
    }

    if (dataToSend.idAreadeportiva) {
      const updated = await AreadeportivaService.updateAreadeportiva(dataToSend.idAreadeportiva, dataToSend); // Actualiza la Areadeportiva
      setItems(prev =>
        prev.map(p => p.idAreadeportiva === updated.idAreadeportiva ? updated : p) // Actualiza la Areadeportiva en el estado
      );
    } else {
      const created = await AreadeportivaService.createAreadeportiva(dataToSend); // Crea la nueva Areadeportiva
      setItems(prev => [created, ...prev]); // Agrega la nueva Areadeportiva al principio de la lista
    }

    setShowForm(false); // Cierra el formulario
    setEditing(null); // Resetea el estado de edición
  } catch (err) {
    console.error("Error guardando Areadeportiva:", err);
    alert("Error guardando Areadeportiva");
  }
}



  return (
    <div className="Areadeportiva-page card">
      <div className="page-header">
        <h2>Areadeportivas</h2>

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
              Nuevo Areadeportiva
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Horario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: "center" }}>Sin datos</td></tr>
            ) : (
              items.map(item => (
                <tr key={item.idAreadeportiva} className={!item.estadoArea ? "row-inactive" : ""}>
                  <td>{item.nombreArea}</td>
                  <td>{item.descripcionArea}</td>
                  <td>{item.emailArea}</td>
                  <td>{item.telefonoArea}</td>
                  <td>{item.horaInicioArea} - {item.horaFinArea}</td>
                  <td>{item.estado ? "Activo" : "Activo"}</td>
                  <td>
                    <button onClick={() => openEdit(item)}>Editar</button>
                    <button onClick={() => handleViewDetail(item)}>Ver detalle</button>
                    {/*<button onClick={() => handleDeactivate(item.idAreadeportiva)}>Desactivar</button>*/}
                    <button onClick={() => handleDelete(item.idAreadeportiva)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <AreadeportivaForm
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
