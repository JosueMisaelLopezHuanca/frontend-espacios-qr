const API_URL = "http://localhost:8033/api/macrodistrito";

export async function getMacrodistritos() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function createMacrodistrito(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function updateMacrodistrito(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function deleteMacrodistrito(id) {
  const res = await fetch(`${API_URL}/${id}/eliminar`, { method: "PUT" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}
