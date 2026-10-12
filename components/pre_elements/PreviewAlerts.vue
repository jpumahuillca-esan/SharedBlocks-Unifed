<script setup lang="ts">
/**
 * PreviewAlerts — muestra las 4 variantes de MoleculeAlert juntas
 * (Elementos > Alerts de webunificada). Solo vista previa, no se usa
 * en bloques reales.
 */
import MoleculeAlert from '../molecules/MoleculeAlert.vue';
import PreviewCodeSample from '../docs/PreviewCodeSample.vue';
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Variantes</span>
      <div class="preview-column-wrap">
        <PreviewCodeSample marker='variant="info"' label="Alerta informativa" block>
        <MoleculeAlert
          variant="info"
          title="Nueva convocatoria abierta"
          text="Las postulaciones para el ciclo 2026-I están disponibles desde el 1 de agosto."
        />
        </PreviewCodeSample>
        <PreviewCodeSample marker='variant="success"' label="Alerta de éxito" block>
        <MoleculeAlert
          variant="success"
          title="Postulación enviada"
          text="Recibirás la confirmación de tu asesor académico en un plazo de 48 horas."
        />
        </PreviewCodeSample>
        <PreviewCodeSample marker='variant="warning"' label="Alerta de advertencia" block>
        <MoleculeAlert
          variant="warning"
          title="Últimas vacantes"
          text="Quedan pocos cupos disponibles para la modalidad presencial."
        />
        </PreviewCodeSample>
        <PreviewCodeSample marker='variant="error"' label="Alerta de error" block>
        <MoleculeAlert
          variant="error"
          title="No pudimos procesar tu solicitud"
          text="Verifica los datos ingresados e inténtalo nuevamente."
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
  gap: 8px;
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
  gap: 10px;
}
</style>
