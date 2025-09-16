import { defineStore } from "pinia";
import { fetchTree } from "../api/folder";

export const useFolderStore = defineStore("folder", {
  state: () => ({
    tree: [] as any[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async loadTree() {
      this.loading = true;
      this.error = null;
      try {
        this.tree = await fetchTree();
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});