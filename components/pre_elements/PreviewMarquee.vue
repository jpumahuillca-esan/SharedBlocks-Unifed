<script setup lang="ts">
/**
 * PreviewMarquee — muestra MoleculeMarquee con el set de ítems exacto de
 * webunificada (Elementos > Marquee) en sus 3 variantes: claro, oscuro,
 * rojo. Solo vista previa, no se usa en bloques reales.
 */
import MoleculeMarquee, { type MarqueeItem } from '../molecules/MoleculeMarquee.vue';

const items: MarqueeItem[] = [
  { label: 'Acreditación internacional', icon: 'award' },
  { label: 'Red global de alumni', icon: 'globe' },
  { label: '+30 años de trayectoria', icon: 'graduation-cap' },
  { label: 'Top ranking Latam', icon: 'trending-up' },
];
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Claro</span>
      <MoleculeMarquee :items="items" />
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Oscuro</span>
      <MoleculeMarquee :items="items" variant="dark" />
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Rojo</span>
      <MoleculeMarquee :items="items" variant="brand" />
    </div>
  </div>
</template>

<style scoped>
.preview-stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
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
</style>
