const API_URL = import.meta.env.VITE_API_URL;

export async function fetchFolders(parentId: number | null = null) {
  const url = parentId == null
    ? `${API_URL}/v1/nodes`
    : `${API_URL}/v1/nodes?parentId=${encodeURIComponent(String(parentId))}`
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch folders");
  const json = await res.json();
  return Array.isArray(json?.data) ? json.data : [];
}

export async function fetchTree() {
  const res = await fetch(`${API_URL}/v1/nodes/tree`);
  if (!res.ok) throw new Error("Failed to fetch tree");
  const json = await res.json();
  return Array.isArray(json?.data) ? json.data : [];
}