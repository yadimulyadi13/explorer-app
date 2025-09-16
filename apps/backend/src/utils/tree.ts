import { Node } from "@prisma/client";

export function getNodeTree(nodes: Node[], parentId: number | null = null): any[] {
  return nodes
    .filter((node) => node.parentId === parentId)
    .map((node) => ({
      ...node,
      children: getNodeTree(nodes, node.id),
    }));
}