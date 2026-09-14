<script setup lang="ts">
/**
 * PreviewBreadcrumb — muestra MoleculeBreadcrumb con el ejemplo exacto
 * de webunificada (Elementos > Breadcrumb): Inicio / Posgrado / MBA
 * Part-Time. Solo vista previa, no se usa en bloques reales.
 */
import MoleculeBreadcrumb from '../molecules/MoleculeBreadcrumb.vue';

const items = [
  { label: 'Inicio', href: '#' },
  { label: 'Posgrado', href: '#' },
  { label: 'MBA Part-Time' },
];
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Ruta de navegación</span>
      <MoleculeBreadcrumb :items="items" />
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
   por default (align-items: stretch); .breadcrumb es inline/compacto y
   no debe ocupar el ancho completo de la sección del canvas. */
.breadcrumb {
  align-self: flex-start;
}
</style>
