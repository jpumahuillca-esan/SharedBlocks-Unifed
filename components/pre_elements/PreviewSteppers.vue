<script setup lang="ts">
/**
 * PreviewSteppers — muestra MoleculeStepper con el ejemplo de admisión
 * de webunificada (Elementos > Steppers). Solo vista previa, no se usa
 * en bloques reales.
 */
import MoleculeStepper, { type StepperStep } from '../molecules/MoleculeStepper.vue';

const steps: StepperStep[] = [
  { label: 'Datos personales', status: 'complete' },
  { label: 'Documentos', status: 'active' },
  { label: 'Pago' },
  { label: 'Confirmación' },
];
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Proceso de admisión</span>
      <MoleculeStepper :steps="steps" />
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
   por default (align-items: stretch). Sin esto, ".stepper" se estira al
   ancho completo de la sección del canvas y sus ".step__connector"
   (flex: 1) se alargan de forma exagerada en vez de conectar los pasos
   con un espacio compacto y razonable. */
.stepper {
  align-self: flex-start;
}
</style>
