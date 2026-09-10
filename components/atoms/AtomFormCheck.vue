<script setup lang="ts">
/**
 * AtomFormCheck — átomo de checkbox/radio (ARCIS Design System,
 * Elementos > Formularios > Checkbox & Radio).
 *
 * Envuelve ".form-check" portada en assets/styles/elements/_forms.scss.
 * ".form-check" es un nombre de clase de Bootstrap 5, y el bloque real
 * form/lead-form-hero/Form.vue ya lo usa con markup Bootstrap plano: por
 * eso este átomo agrega también el marcador "form-check--arcis" (ver
 * comentario de colisión al inicio de _forms.scss) — nunca usar
 * ".form-check" a mano en markup real, siempre a través de este átomo.
 *
 * type="checkbox": modelValue es boolean.
 * type="radio": modelValue es el valor del grupo completo; se marca
 * cuando modelValue === value (mismo patrón que un v-model de radios
 * nativo de Vue).
 */
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  type?: 'checkbox' | 'radio';
  modelValue?: boolean | string;
  /** Solo para type="radio": valor de esta opción dentro del grupo. */
  value?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
}>(), {
  type: 'checkbox',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean | string];
}>();

const classes = computed(() => ['form-check', 'form-check--arcis']);

const isChecked = computed(() =>
  props.type === 'radio' ? props.modelValue === props.value : Boolean(props.modelValue)
);

const onChange = (event: Event) => {
  if (props.type === 'radio') {
    emit('update:modelValue', props.value ?? '');
  } else {
    emit('update:modelValue', (event.target as HTMLInputElement).checked);
  }
};
</script>

<template>
  <label :class="classes">
    <input
      :type="type"
      :name="name"
      :id="id"
      :disabled="disabled"
      :checked="isChecked"
      @change="onChange"
    />
    <slot />
  </label>
</template>
