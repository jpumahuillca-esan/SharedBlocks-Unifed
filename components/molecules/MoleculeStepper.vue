<script setup lang="ts">
/**
 * MoleculeStepper — Stepper (ARCIS Design System, Elementos > Steppers).
 *
 * Vive en components/molecules/ y no en components/atoms/ porque está
 * compuesto de otro átomo (AtomIcon, para el check del paso completado)
 * y arma varios pasos a partir de una lista — mismo criterio que
 * MoleculeCard/MoleculeAlert.
 *
 * Envuelve las clases .stepper, .step, .step__index, .step__label,
 * .step__connector, .is-complete e .is-active portadas en
 * assets/styles/elements/_steppers.scss. No redeclara estilos propios.
 *
 * Cada ".step" y su ".step__connector" se renderizan como hermanos
 * directos (no uno dentro del otro): el CSS real usa un combinador de
 * hermano adyacente (".step.is-complete + .step__connector") para pintar
 * el conector de rojo después de un paso completado, igual que en
 * webunificada.
 */
import AtomIcon from '../atoms/AtomIcon.vue';

export interface StepperStep {
  label: string;
  status?: 'complete' | 'active' | 'pending';
}

withDefaults(defineProps<{
  steps: StepperStep[];
}>(), {
  steps: () => [],
});
</script>

<template>
  <div class="stepper">
    <template v-for="(step, index) in steps" :key="index">
      <div class="step" :class="{ 'is-complete': step.status === 'complete', 'is-active': step.status === 'active' }">
        <span class="step__index">
          <AtomIcon v-if="step.status === 'complete'" name="check" :size="16" />
          <template v-else>{{ index + 1 }}</template>
        </span>
        <span class="step__label">{{ step.label }}</span>
      </div>
      <span v-if="index < steps.length - 1" class="step__connector"></span>
    </template>
  </div>
</template>
