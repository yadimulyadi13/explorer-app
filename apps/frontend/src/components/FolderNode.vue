<template>
  <li class="node-item">
    <div class="node-row">
      <!-- button expand if has children -->
      <button class="toggle" v-if="hasChildren" @click="toggle(node)">
        <span v-if="node._open">▾</span>
        <span v-else>▸</span>
      </button>

      <!-- click to select folder/file -->
      <span class="node-name" @click="select(node)">{{ node.name }}</span>
      <span v-if="node._loading" class="node-loading">(loading...)</span>
    </div>

    <!-- render children -->
    <ul v-if="node._open && node.children?.length" class="folder-tree">
      <FolderNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        @select="select"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'

defineOptions({ name: 'FolderNode' })

const props = defineProps<{ node: any }>()
const emit = defineEmits<{ (e: 'select', node: any): void }>()

const loadChildren = inject<(node: any) => Promise<void>>('loadChildren')!

const hasChildren = computed(() =>
  (Array.isArray(props.node.children) && props.node.children.length > 0) ||
  props.node.type === 'FOLDER'
)

async function toggle(node: any) {
  node._open = !node._open
  if (node._open && loadChildren) {
    await loadChildren(node)
  }
}

function select(node: any) {
  emit('select', node)
}
</script>

<style scoped>
.node-item { margin: 0.2rem 0; }
.node-row { display: flex; align-items: center; gap: 0.25rem; }
.toggle { margin-right: 0.3rem; }
.node-name { cursor: pointer; }
.node-loading { font-size: 0.85em; color: #666; margin-left: 0.25rem; }
</style>