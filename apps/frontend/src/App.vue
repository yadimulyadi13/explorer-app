<script setup lang="ts">
import { onMounted } from "vue";
import { useFolderStore } from "./store/folder";
import FolderTree from "./components/FolderTree.vue";

const folderStore = useFolderStore();

onMounted(() => {
  folderStore.loadTree();
});

function handleSelect(node: any) {
  console.log("Selected:", node);
}

async function loadChildren(node: any) {
  // Lazy-load children only when first expanded and children not yet loaded
  if (node && node._open && (!node.children || node.children.length === 0)) {
    node._loading = true;
    try {
      const res = await fetch(`/api/v1/nodes/${node.id}/children`);
      const data = await res.json();
      node.children = Array.isArray(data?.data) ? data.data : [];
    } catch (e) {
      console.error("Failed to load children", e);
    } finally {
      node._loading = false;
    }
  }
}
</script>

<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">📂 Explorer App</h1>

    <div v-if="folderStore.loading">Loading...</div>
    <div v-else-if="folderStore.error" class="text-red-500">
      {{ folderStore.error }}
    </div>
    <FolderTree
      v-else
      :nodes="folderStore.tree"
      :load-children="loadChildren"
      @select="handleSelect"
    />
  </div>
</template>
