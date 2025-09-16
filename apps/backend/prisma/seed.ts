import { NodeType, PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

// example JSON structure
const folderTree = {
  name: "root",
  children: [
    {
      name: "Documents",
      children: [
        {
          name: "Work",
          children: [
            { name: "Reports", children: [] },
            { name: "Invoices", children: [] }
          ]
        },
        { name: "Personal", children: [] }
      ]
    },
    {
      name: "Pictures",
      children: [
        { name: "Vacation", children: [] },
        { name: "Family", children: [] }
      ]
    }
  ]
};

// Recursive insert function
async function insertNode(
  node: { name: string; children?: any[] },
  parentId: number | null = null
): Promise<void> {
  const created = await prisma.node.create({
    data: {
      name: node.name,
      type: NodeType.FOLDER, // default folder
      parentId,
    },
  });

  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      await insertNode(child, created.id);
    }
  }
}

async function main() {
  console.log("🌱 Seeding database...");
  await prisma.node.deleteMany(); // clear all data
  await insertNode(folderTree);
  console.log("✅ Seeding selesai!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });