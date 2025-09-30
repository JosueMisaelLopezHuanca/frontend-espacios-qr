const API_URL = "http://localhost:8032/api/qr";

export async function getQRsByReserva(idReserva) {
  const res = await fetch(`${API_URL}/reserva/${idReserva}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function createQR(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function updateQR(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function deleteQR(id) {
  const res = await fetch(`${API_URL}/${id}/eliminar`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}
