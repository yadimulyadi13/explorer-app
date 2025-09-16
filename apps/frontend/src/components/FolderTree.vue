<template>
  <ul class="folder-tree">
    <FolderNode
      v-for="node in nodes"
      :key="node.id"
      :node="node"
      @select="select"
    />
  </ul>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import FolderNode from './FolderNode.vue'

const props = defineProps<{ nodes: any[]; loadChildren: (node: any) => Promise<void> }>()
const emit = defineEmits<{ (e: 'select', node: any): void }>()

provide('loadChildren', props.loadChildren)

function select(node: any) {
  emit('select', node)
}
</script>

<style scoped>
.folder-tree { padding-left: 0.5rem; list-style: none; margin: 0; }
</style>