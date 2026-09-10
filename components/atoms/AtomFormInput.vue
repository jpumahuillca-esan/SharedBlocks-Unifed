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
 */
type InputType = 'text' | 'email' | 'tel' | 'password' | 'number' | 'date' | 'url';

withDefaults(defineProps<{
  modelValue?: string;
  type?: InputType;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}>(), {
  type: 'text',
});

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <input
    class="form-input"
    :type="type"
    :id="id"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
