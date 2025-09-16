import { nodeRepository } from '../repositories/nodeRepository'
import { getNodeTree } from '../utils/tree'

export const nodeService = {
  getTree: async () => {
    const all = await nodeRepository.findAll()
    return getNodeTree(all)
  },
  getChildren: async (id: number | null) => {
    return nodeRepository.findChildren(id)
  },
  createNode: async (name: string, type: 'FOLDER' | 'FILE', parentId?: number) => {
    return nodeRepository.create({ name, type, parentId })
  },
}