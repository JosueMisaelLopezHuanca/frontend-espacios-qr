const API_URL = "http://localhost:8038/api/reservas";

export async function getReservas() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function createReserva(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function updateReserva(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function deleteReserva(id) {
  const res = await fetch(`${API_URL}/${id}/eliminar`, { method: "PUT" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}
