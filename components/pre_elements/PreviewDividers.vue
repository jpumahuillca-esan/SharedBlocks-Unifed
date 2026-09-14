<script setup lang="ts">
/**
 * PreviewDividers — muestra las 3 variantes de AtomDivider juntas
 * (Elementos > Dividers de webunificada). Solo vista previa, no se usa
 * en bloques reales.
 */
import AtomDivider from '../atoms/AtomDivider.vue';
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Horizontal</span>
      <AtomDivider variant="horizontal" />
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Con etiqueta</span>
      <AtomDivider variant="label">o continúa con</AtomDivider>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Vertical</span>
      <div class="preview-vertical-row">
        <span>Pregrado</span>
        <AtomDivider variant="vertical" />
        <span>Posgrado</span>
        <AtomDivider variant="vertical" />
        <span>Educación Ejecutiva</span>
      </div>
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
.preview-vertical-row {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
}
</style>
