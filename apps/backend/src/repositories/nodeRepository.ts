import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const nodeRepository = {
  findById: (id: number) => prisma.node.findUnique({ where: { id } }),
  findChildren: (parentId: number | null) =>
    prisma.node.findMany({ where: { parentId } }),
  findAll: () => prisma.node.findMany(),
  create: (data: { name: string; type: 'FOLDER' | 'FILE'; parentId?: number }) =>
    prisma.node.create({ data }),
}