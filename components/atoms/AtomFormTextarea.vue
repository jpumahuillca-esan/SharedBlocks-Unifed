<script setup lang="ts">
/**
 * AtomFormTextarea — átomo de área de texto multilínea (ARCIS Design
 * System, Elementos > Formularios > Campos).
 *
 * Envuelve ".form-textarea" portada en assets/styles/elements/_forms.scss.
 * No colisiona con Bootstrap, no necesita marcador extra.
 *
 * Mismos cuatro estados de borde que AtomFormInput (ver su comentario).
 */
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  modelValue?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  /** Ver AtomFormInput: "focus" es el estado dibujado, no el foco real. */
  state?: 'focus' | 'error' | 'success';
}>(), {
  rows: 4,
});

defineEmits<{
  'update:modelValue': [value: string];
}>();

const classes = computed(() => [
  'form-textarea',
  props.modelValue ? 'is-filled' : null,
  props.state ? `is-${props.state}` : null,
]);
</script>

<template>
  <textarea
    :class="classes"
    :id="id"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :rows="rows"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  ></textarea>
</template>
