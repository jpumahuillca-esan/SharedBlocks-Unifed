<script setup lang="ts">
/**
 * PreviewAlerts — muestra las 4 variantes de MoleculeAlert juntas
 * (Elementos > Alerts de webunificada). Solo vista previa, no se usa
 * en bloques reales.
 */
import MoleculeAlert from '../molecules/MoleculeAlert.vue';
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Variantes</span>
      <div class="preview-column-wrap">
        <MoleculeAlert
          variant="info"
          title="Nueva convocatoria abierta"
          text="Las postulaciones para el ciclo 2026-I están disponibles desde el 1 de agosto."
        />
        <MoleculeAlert
          variant="success"
          title="Postulación enviada"
          text="Recibirás la confirmación de tu asesor académico en un plazo de 48 horas."
        />
        <MoleculeAlert
          variant="warning"
          title="Últimas vacantes"
          text="Quedan pocos cupos disponibles para la modalidad presencial."
        />
        <MoleculeAlert
          variant="error"
          title="No pudimos procesar tu solicitud"
          text="Verifica los datos ingresados e inténtalo nuevamente."
        />
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
