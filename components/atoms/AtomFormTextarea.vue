<script setup lang="ts">
/**
 * AtomFormTextarea — átomo de área de texto multilínea (ARCIS Design
 * System, Elementos > Formularios > Campos).
 *
 * Envuelve ".form-textarea" portada en assets/styles/elements/_forms.scss.
 * No colisiona con Bootstrap, no necesita marcador extra.
 */
withDefaults(defineProps<{
  modelValue?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
}>(), {
  rows: 4,
});

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <textarea
    class="form-textarea"
    :id="id"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :rows="rows"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  ></textarea>
</template>
