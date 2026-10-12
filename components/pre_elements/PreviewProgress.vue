<script setup lang="ts">
/**
 * PreviewProgress — muestra MoleculeProgress con los 3 ejemplos de
 * webunificada (Elementos > Progress bars): default, success, warning+sm.
 * Solo vista previa, no se usa en bloques reales.
 */
import MoleculeProgress from '../molecules/MoleculeProgress.vue';
import PreviewCodeSample from '../docs/PreviewCodeSample.vue';
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Barra lineal y variantes semánticas</span>
      <div class="preview-column-wrap">
        <PreviewCodeSample marker='<MoleculeProgress label="Perfil de postulante completo"' label="Progreso estándar" block>
          <MoleculeProgress label="Perfil de postulante completo" :value="65" />
        </PreviewCodeSample>
        <PreviewCodeSample marker='<MoleculeProgress label="Documentos aprobados"' label="Progreso completado" block>
          <MoleculeProgress label="Documentos aprobados" :value="100" variant="success" />
        </PreviewCodeSample>
        <PreviewCodeSample marker="<MoleculeProgress" :occurrence="2" label="Progreso con advertencia" block>
        <MoleculeProgress
          label="Plazo de pago de matrícula"
          :value="85"
          variant="warning"
          size="sm"
          meta="Quedan 3 días"
        />
        </PreviewCodeSample>
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
  gap: 20px;
  max-width: 360px;
}
</style>
