<script setup lang="ts">
/**
 * MoleculeFormField — campo de formulario completo (ARCIS Design System,
 * Elementos > Formularios > Campos).
 *
 * Vive en components/molecules/ y no en components/atoms/ porque compone
 * varios átomos (AtomFormLabel, AtomFormInput/AtomFormTextarea/
 * AtomFormSelect según `as`, AtomFormHelp) — es el equivalente del
 * ".form-group" de webunificada, que en su guía viva siempre aparece
 * como label + control + texto de ayuda juntos, nunca sueltos.
 *
 * El estado de error (".form-group.has-error", ver _forms.scss) se activa
 * pasando `error`: como boolean solo aplica el estilo, como string además
 * reemplaza el texto de ayuda por el mensaje de error.
 */
import { computed } from 'vue';
import AtomFormLabel from '../atoms/AtomFormLabel.vue';
import AtomFormInput from '../atoms/AtomFormInput.vue';
import AtomFormTextarea from '../atoms/AtomFormTextarea.vue';
import AtomFormSelect, { type FormSelectOption } from '../atoms/AtomFormSelect.vue';
import AtomFormHelp from '../atoms/AtomFormHelp.vue';

type FieldKind = 'input' | 'textarea' | 'select';
type InputType = 'text' | 'email' | 'tel' | 'password' | 'number' | 'date' | 'url';

const props = withDefaults(defineProps<{
  as?: FieldKind;
  /** Solo para as="input". */
  type?: InputType;
  modelValue?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  help?: string;
  /** true: solo estilo de error. string: además reemplaza el texto de ayuda. */
  error?: boolean | string;
  /** Solo para as="select". */
  options?: FormSelectOption[];
  required?: boolean;
  disabled?: boolean;
}>(), {
  as: 'input',
  type: 'text',
  options: () => [],
});

defineEmits<{
  'update:modelValue': [value: string];
}>();

const hasError = computed(() => Boolean(props.error));
const helpText = computed(() => (typeof props.error === 'string' ? props.error : props.help));
</script>

<template>
  <div class="form-group" :class="{ 'has-error': hasError }">
    <AtomFormLabel v-if="label" :for="id">{{ label }}</AtomFormLabel>

    <AtomFormInput
      v-if="as === 'input'"
      :type="type"
      :id="id"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <AtomFormTextarea
      v-else-if="as === 'textarea'"
      :id="id"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <AtomFormSelect
      v-else-if="as === 'select'"
      :id="id"
      :options="options"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    />

    <AtomFormHelp v-if="helpText">{{ helpText }}</AtomFormHelp>
  </div>
</template>
