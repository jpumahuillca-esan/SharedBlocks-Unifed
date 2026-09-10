<script setup lang="ts">
/**
 * PreviewCollapse — muestra MoleculeCollapse con el ejemplo exacto de
 * webunificada (Elementos > Collapse): dos preguntas de FAQ, la primera
 * abierta por defecto. Solo vista previa, no se usa en bloques reales.
 */
import MoleculeCollapse from '../molecules/MoleculeCollapse.vue';
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">FAQ</span>
      <div class="preview-column-wrap">
        <MoleculeCollapse title="¿Qué documentos necesito para postular?" default-open>
          Copia de DNI, grado de bachiller o título profesional, CV documentado y dos cartas de recomendación.
        </MoleculeCollapse>
        <MoleculeCollapse title="¿Hay financiamiento disponible?">
          Sí, contamos con líneas de financiamiento propio y convenios con entidades bancarias.
        </MoleculeCollapse>
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
  gap: 12px;
}
.preview-group__label {
  font-size: 10px;
  font-family: monospace;
  color: #999;
  text-transform: uppercase;
}
.preview-column-wrap {
  display: flex;
  flex-direction: column;
  max-width: 480px;
}
</style>
