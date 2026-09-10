<script setup lang="ts">
/**
 * PreviewButtonGroup — muestra MoleculeButtonGroup en sus 2 variantes
 * (Elementos > Button Group de webunificada): texto y solo ícono.
 * Interactivo de verdad (click cambia la selección). Solo vista previa,
 * no se usa en bloques reales.
 */
import { ref } from 'vue';
import MoleculeButtonGroup from '../molecules/MoleculeButtonGroup.vue';

const nivel = ref('pregrado');
const nivelItems = [
  { value: 'pregrado', label: 'Pregrado' },
  { value: 'posgrado', label: 'Posgrado' },
  { value: 'executive', label: 'Executive' },
];

const vista = ref('grid');
const vistaItems = [
  { value: 'grid', icon: 'layout-grid', ariaLabel: 'Vista de cuadrícula' },
  { value: 'list', icon: 'list', ariaLabel: 'Vista de lista' },
];
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Texto</span>
      <MoleculeButtonGroup
        :items="nivelItems"
        v-model="nivel"
        aria-label="Nivel académico"
      />
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Solo ícono</span>
      <MoleculeButtonGroup
        :items="vistaItems"
        v-model="vista"
        aria-label="Tipo de vista"
      />
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
  gap: 8px;
}
.preview-group__label {
  font-size: 10px;
  font-family: monospace;
  color: #999;
  text-transform: uppercase;
}
/* .preview-group es flex column sin align-items (default: stretch), así
   que sin esto el ".btn-group" (inline-flex, pensado para ocupar solo
   su contenido) se estira al ancho completo de la sección del canvas
   en vez de quedarse compacto — mismo bug que hay que evitar en
   cualquier Elemento compacto agregado directo a .preview-group. */
.btn-group {
  align-self: flex-start;
}
</style>
