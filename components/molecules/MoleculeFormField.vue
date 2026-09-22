<script setup lang="ts">
/**
 * MoleculeFormField — campo de formulario completo (ARCIS Design System,
 * Elementos > Formularios).
 *
 * Vive en components/molecules/ y no en components/atoms/ porque compone
 * varios átomos (AtomFormLabel, AtomFormInput/AtomFormTextarea/
 * AtomFormSelect según `as`, AtomFormHelp, AtomIcon) — es el equivalente
 * del ".form-group" de webunificada, que siempre aparece como label +
 * control + texto de ayuda juntos, nunca sueltos.
 *
 * Tres formas, las tres de la lámina de formularios del Figma:
 *
 * - stacked (por defecto): etiqueta encima del campo. Es el "Form group"
 *   de la lámina; con `required`, la etiqueta lleva su asterisco rojo.
 * - floating: la etiqueta empieza dentro del campo y sube a sentarse
 *   sobre el borde superior cuando hay foco o valor, abriéndole una
 *   muesca. Admite el ícono de estado a la derecha (la (i) gris, el
 *   check verde o el (!) rojo de la lámina).
 * - search: el buscador, con la lupa a la izquierda. No dibuja etiqueta;
 *   si se le pasa `label`, va al campo como aria-label para que el
 *   lector de pantalla sepa qué se busca.
 *
 * El estado de error (".form-group.has-error", ver _forms.scss) se
 * activa con `error`, y el de éxito con `success`: como boolean solo
 * aplican el estilo, como string además reemplazan el texto de ayuda.
 */
import { computed } from 'vue';
import AtomFormLabel from '../atoms/AtomFormLabel.vue';
import AtomFormInput from '../atoms/AtomFormInput.vue';
import AtomFormTextarea from '../atoms/AtomFormTextarea.vue';
import AtomFormSelect, { type FormSelectOption } from '../atoms/AtomFormSelect.vue';
import AtomFormHelp from '../atoms/AtomFormHelp.vue';
import AtomIcon from '../atoms/AtomIcon.vue';

type FieldKind = 'input' | 'textarea' | 'select';
type InputType = 'text' | 'email' | 'tel' | 'password' | 'number' | 'date' | 'url' | 'search';
type FieldVariant = 'stacked' | 'floating' | 'search';

const props = withDefaults(defineProps<{
  as?: FieldKind;
  variant?: FieldVariant;
  /** Solo para as="input". En variant="search" se fuerza a "search". */
  type?: InputType;
  modelValue?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  help?: string;
  /** true: solo estilo de error. string: además reemplaza el texto de ayuda. */
  error?: boolean | string;
  /** true: solo estilo de éxito. string: además reemplaza el texto de ayuda. */
  success?: boolean | string;
  /**
   * Ícono de estado a la derecha del campo. Por defecto lo deduce de
   * `error`/`success`; se pasa a mano para la (i) informativa, que no
   * corresponde a ningún estado de validación.
   */
  status?: 'info' | 'success' | 'error';
  /** Solo para as="select". */
  options?: FormSelectOption[];
  required?: boolean;
  disabled?: boolean;
  /** Fuerza el estado dibujado del control (ver AtomFormInput). */
  state?: 'focus' | 'error' | 'success';
}>(), {
  as: 'input',
  variant: 'stacked',
  type: 'text',
  options: () => [],
});

defineEmits<{
  'update:modelValue': [value: string];
}>();

const hasError = computed(() => Boolean(props.error) || props.state === 'error');
const hasSuccess = computed(() => !hasError.value && (Boolean(props.success) || props.state === 'success'));

const helpText = computed(() => {
  if (typeof props.error === 'string') return props.error;
  if (typeof props.success === 'string') return props.success;
  return props.help;
});

/**
 * El ícono explícito manda; si no, lo dicta el estado de validación, pero
 * solo en la forma con etiqueta flotante: en la lámina el campo simple, el
 * dropdown y el área de texto avisan del error únicamente con el borde
 * rojo. (En el dropdown el ícono además se montaría sobre el chevron.)
 */
const statusIcon = computed<'info' | 'check' | 'alert-circle' | null>(() => {
  const automatico = props.variant === 'floating'
    ? (hasError.value ? 'error' : hasSuccess.value ? 'success' : null)
    : null;
  const kind = props.status ?? automatico;
  if (kind === 'info') return 'info';
  if (kind === 'success') return 'check';
  if (kind === 'error') return 'alert-circle';
  return null;
});

/**
 * La etiqueta flotante también sube cuando el campo tiene placeholder:
 * si se quedara abajo, las dos frases se pisarían. Es lo que muestra la
 * lámina, donde el campo vacío enseña la etiqueta arriba y el
 * placeholder dentro.
 */
const isFloated = computed(() => Boolean(props.modelValue) || Boolean(props.placeholder));

const fieldClasses = computed(() => [
  'form-field',
  props.variant === 'floating' ? 'form-field--floating' : null,
  props.variant === 'floating' && isFloated.value ? 'is-floated' : null,
  props.variant === 'search' ? 'form-field--search form-field--icon-start' : null,
  statusIcon.value ? 'form-field--icon-end' : null,
]);

const resolvedType = computed<InputType>(() => (props.variant === 'search' ? 'search' : props.type));

/** En el buscador la etiqueta no se dibuja: viaja como nombre accesible. */
const ariaLabel = computed(() => (props.variant === 'search' ? props.label : undefined));
</script>

<template>
  <div class="form-group" :class="{ 'has-error': hasError, 'has-success': hasSuccess }">
    <AtomFormLabel v-if="label && variant === 'stacked'" :for="id" :required="required">
      {{ label }}
    </AtomFormLabel>

    <div :class="fieldClasses">
      <span v-if="variant === 'search'" class="form-field__icon">
        <AtomIcon name="search" :size="20" />
      </span>

      <AtomFormInput
        v-if="as === 'input'"
        :type="resolvedType"
        :id="id"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :state="state"
        :aria-label="ariaLabel"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
      />
      <AtomFormTextarea
        v-else-if="as === 'textarea'"
        :id="id"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :state="state"
        :aria-label="ariaLabel"
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
        :state="state"
        :aria-label="ariaLabel"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
      />

      <AtomFormLabel v-if="label && variant === 'floating'" :for="id" floating :required="required">
        {{ label }}
      </AtomFormLabel>

      <span v-if="statusIcon" class="form-field__status">
        <AtomIcon :name="statusIcon" :size="20" />
      </span>
    </div>

    <AtomFormHelp v-if="helpText">{{ helpText }}</AtomFormHelp>
  </div>
</template>
