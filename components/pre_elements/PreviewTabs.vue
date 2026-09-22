<script setup lang="ts">
/**
 * PreviewTabs — muestra MoleculeTabs en sus tres formas (Elementos >
 * Tabs), como la lámina del Figma: la horizontal con subrayado, la
 * vertical y la de tarjetas con ícono.
 *
 * Cada una lleva su propio estado para que se puedan probar por separado.
 * Solo vista previa, no se usa en bloques reales.
 */
import { ref } from 'vue';
import MoleculeTabs, { type TabItem } from '../molecules/MoleculeTabs.vue';

const pestanas: TabItem[] = [
  { id: 'general', label: 'Información general' },
  { id: 'plan', label: 'Plan de estudios' },
  { id: 'admision', label: 'Admisión' },
  { id: 'inversion', label: 'Inversión' },
];

const conIcono: TabItem[] = [
  { id: 'academico', label: 'Excelencia académica', icon: 'graduation-cap' },
  { id: 'global', label: 'Alcance global', icon: 'globe' },
  { id: 'red', label: 'Red de egresados', icon: 'users' },
  { id: 'investigacion', label: 'Investigación', icon: 'book-open' },
];

const horizontal = ref('general');
const vertical = ref('plan');
const cards = ref('academico');

/* El nombre de la pestaña abierta, para el panel de ejemplo. */
const etiqueta = (lista: TabItem[], id: string) => lista.find((tab) => tab.id === id)?.label ?? '';
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Subrayado (horizontal)</span>
      <MoleculeTabs v-model="horizontal" :items="pestanas" aria-label="Secciones del programa" />
      <p class="preview-panel">Panel de «{{ etiqueta(pestanas, horizontal) }}».</p>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Vertical</span>
      <div class="preview-row">
        <MoleculeTabs
          v-model="vertical"
          variant="vertical"
          :items="pestanas"
          aria-label="Secciones del programa"
        />
        <p class="preview-panel">Panel de «{{ etiqueta(pestanas, vertical) }}».</p>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Cards (con ícono)</span>
      <MoleculeTabs
        v-model="cards"
        variant="cards"
        :items="conIcono"
        aria-label="Pilares de la propuesta de valor"
      />
      <p class="preview-panel">Panel de «{{ etiqueta(conIcono, cards) }}».</p>
    </div>
  </div>
</template>

<style scoped>
.preview-stack {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 16px;
  max-width: 640px;
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
.preview-row {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}
.preview-panel {
  margin: 0;
  font-size: 14px;
  color: #666;
}
</style>
