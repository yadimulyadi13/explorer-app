import { ref } from 'vue'

const API = '/api/v1' // via Vite proxy, versioned API base path

function normalize(nodes: any[] = []) {
  return nodes.map((n): { _open: boolean; _loading: boolean; children: any[]; [key: string]: any } => ({
    ...n,
    _open: n._open ?? false,
    _loading: n._loading ?? false,
    children: n.children ? normalize(n.children) : []
  }))
}

export function useExplorer() {
  const folders = ref<any[]>([])      // root folders (for left panel)
  const selectedFolder = ref<number | null>(null)
  const children = ref<any[]>([])     // right panel list

  // Get root nodes (parentId = null default on backend)
  const fetchTree = async () => {
    const res = await fetch(`${API}/nodes`)
    const data = await res.json()
    folders.value = normalize(Array.isArray(data?.data) ? data.data : [])
  }

  // Get direct children for right panel
  const fetchChildren = async (id: number) => {
    selectedFolder.value = id
    const res = await fetch(`${API}/nodes/${id}/children`)
    const data = await res.json()
    children.value = Array.isArray(data?.data)
      ? normalize(data.data)
      : []
  }

  // Lazy-load children on left panel (expand tree) + indicator loading per node
  const loadChildren = async (node: any) => {
    if (node._open && (!node.children || node.children.length === 0)) {
      node._loading = true
      try {
        const res = await fetch(`${API}/nodes/${node.id}/children`)
        const data = await res.json()
        node.children = Array.isArray(data?.data)
          ? normalize(data.data)
          : []
      } finally {
        node._loading = false
      }
    }
  }

  return { folders, selectedFolder, children, fetchTree, fetchChildren, loadChildren }
}