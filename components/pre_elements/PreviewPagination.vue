<script setup lang="ts">
/**
 * PreviewPagination — muestra MoleculePagination con el ejemplo exacto
 * de webunificada (Elementos > Pagination): 8 páginas, empezando en la 1.
 * Interactivo (click cambia de página de verdad). Solo vista previa,
 * no se usa en bloques reales.
 */
import { ref } from 'vue';
import MoleculePagination from '../molecules/MoleculePagination.vue';

const currentPage = ref(1);
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Navegación de páginas</span>
      <MoleculePagination :current-page="currentPage" :total-pages="8" @change="currentPage = $event" />
    </div>
  </div>
</template>

<style scoped>
.preview-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
}
.preview-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.preview-group__label {
  font-size: 10px;
  font-family: monospace;
  color: #999;
  text-transform: uppercase;
}
/* Ver PreviewButtonGroup.vue: .preview-group estira a sus hijos directos
   por default (align-items: stretch); .pagination es un nav compacto y
   no debe ocupar el ancho completo de la sección del canvas. */
.pagination {
  align-self: flex-start;
}
</style>
