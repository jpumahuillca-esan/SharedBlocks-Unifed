<script setup lang="ts">
/**
 * AtomFormSelect — átomo de selector (ARCIS Design System,
 * Elementos > Formularios > Campos).
 *
 * Envuelve ".form-select" portada en assets/styles/elements/_forms.scss.
 * ".form-select" es un nombre de clase de Bootstrap 5, y el bloque real
 * form/lead-form-hero/Form.vue ya lo usa con markup Bootstrap plano: por
 * eso este átomo agrega también el marcador "form-select--arcis" (ver
 * comentario de colisión al inicio de _forms.scss) — nunca usar
 * ".form-select" a mano en markup real, siempre a través de este átomo.
 */
import { computed } from 'vue';

export interface FormSelectOption {
  value: string;
  label: string;
}

const props = withDefaults(defineProps<{
  modelValue?: string;
  id?: string;
  options: FormSelectOption[];
  /** Texto de la opción vacía inicial (ej. "Selecciona un programa"). */
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  /** Ver AtomFormInput: "focus" es el estado dibujado, no el foco real. */
  state?: 'focus' | 'error' | 'success';
}>(), {
  options: () => [],
});

defineEmits<{
  'update:modelValue': [value: string];
}>();

const classes = computed(() => [
  'form-select',
  'form-select--arcis',
  props.modelValue ? 'is-filled' : null,
  props.state ? `is-${props.state}` : null,
]);
</script>

<template>
  <select
    :class="classes"
    :id="id"
    :disabled="disabled"
    :required="required"
    :value="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <option v-if="placeholder" value="">{{ placeholder }}</option>
    <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
  </select>
</template>
