<script setup lang="ts">
/**
 * AtomFormInput — átomo de campo de texto (ARCIS Design System,
 * Elementos > Formularios > Campos).
 *
 * Envuelve ".form-input" portada en assets/styles/elements/_forms.scss.
 * ".form-input" no colisiona con Bootstrap (Bootstrap usa ".form-control"),
 * así que no necesita marcador extra como AtomFormSelect/AtomFormCheck.
 *
 * Soporta v-model directo (modelValue).
 *
 * El borde cambia solo según el estado del campo (ver la lámina de
 * formularios del Figma): gris claro vacío, gris fuerte con valor, azul
 * con foco, rojo en error, verde en éxito. Los dos primeros salen de acá
 * (la clase "is-filled" la pone este átomo al haber valor); el foco lo
 * pone el navegador; error y éxito se piden con la prop `state`, o los
 * hereda del MoleculeFormField que lo contenga.
 */
import { computed } from 'vue';

type InputType = 'text' | 'email' | 'tel' | 'password' | 'number' | 'date' | 'url' | 'search';

const props = withDefaults(defineProps<{
  modelValue?: string;
  type?: InputType;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  /**
   * Fuerza un estado visual. "focus" no es el foco real del navegador:
   * existe para poder mostrar ese estado en la guía viva, donde nada
   * tiene el foco.
   */
  state?: 'focus' | 'error' | 'success';
}>(), {
  type: 'text',
});

defineEmits<{
  'update:modelValue': [value: string];
}>();

const classes = computed(() => [
  'form-input',
  props.modelValue ? 'is-filled' : null,
  props.state ? `is-${props.state}` : null,
]);
</script>

<template>
  <input
    :class="classes"
    :type="type"
    :id="id"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
