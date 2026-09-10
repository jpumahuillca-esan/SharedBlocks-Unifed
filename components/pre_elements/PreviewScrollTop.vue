<script setup lang="ts">
/**
 * PreviewScrollTop — muestra MoleculeScrollTop en modo `preview`
 * (Elementos > Scroll top de webunificada). Solo vista previa, no se
 * usa en bloques reales.
 *
 * El botón real es position:fixed y solo aparece pasado cierto scroll
 * de la ventana — acá se fuerza `preview` para que se vea siempre,
 * contenido dentro de este recuadro (position:absolute) en vez de
 * escaparse por encima de la UI real del editor.
 */
import MoleculeScrollTop from '../molecules/MoleculeScrollTop.vue';
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Botón flotante (siempre visible en esta vista previa)</span>
      <div class="preview-stage">
        <MoleculeScrollTop preview />
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
.preview-stage {
  position: relative;
  overflow: hidden;
  height: 140px;
  border-radius: 8px;
  background: #f2f2f2;
}
</style>
