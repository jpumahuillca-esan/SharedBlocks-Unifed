<template>
  <div class="editor-field">
    <label v-if="label" :class="labelClass" :for="fieldId">{{ label }}</label>

    <EditorHint v-if="hasHint && hintPosition === 'top'" :tone="hintTone">
      <slot name="hint">{{ hint }}</slot>
    </EditorHint>

    <slot />

    <div v-if="maxlength && counter" class="editor-field__limit">
      <span>Máximo {{ maxlength }} caracteres.</span>
      <span class="editor-field__counter">{{ length }}/{{ maxlength }}</span>
    </div>

    <EditorHint v-if="hasHint && hintPosition === 'bottom'" after :tone="hintTone">
      <slot name="hint">{{ hint }}</slot>
    </EditorHint>
  </div>
</template>

<script setup lang="ts">
/**
 * Armazón de un campo del panel: etiqueta, ayuda, el control (slot) y el
 * contador de caracteres. Es lo que repetía cada editor a mano.
 *
 * No es un campo por sí mismo: lo componen EditorText y EditorTextarea. El
 * orden es siempre etiqueta, ayuda (arriba), control, contador y ayuda (abajo,
 * para los avisos que dependen de lo escrito, como el del video).
 *
 * El margen de abajo NO lo pone él: lo pone quien lo usa con `class="mb-2"`,
 * igual que antes se le ponía al input.
 */
import { computed, useSlots } from 'vue';
import EditorHint from '../EditorHint/EditorHint.vue';

const props = withDefaults(
  defineProps<{
    label?: string;
    /** Clase de la etiqueta; `form-label` de Bootstrap salvo en paneles que usan otra. */
    labelClass?: string;
    hint?: string;
    /** `top`: entre la etiqueta y el control. `bottom`: tras el control y el contador. */
    hintPosition?: 'top' | 'bottom';
    hintTone?: 'default' | 'warn';
    /** Id del control al que apunta la etiqueta. */
    fieldId?: string;
    /** Con él se dibuja "Máximo N caracteres" y el contador. */
    maxlength?: number;
    /** `false` pone el tope pero no dibuja el contador (destinos de enlace). */
    counter?: boolean;
    /** Caracteres escritos, para el contador. */
    length?: number;
  }>(),
  {
    labelClass: 'form-label',
    hintPosition: 'top',
    hintTone: 'default',
    counter: true,
    length: 0,
  },
);

const slots = useSlots();

const hasHint = computed(() => Boolean(props.hint) || Boolean(slots.hint));
</script>

<style scoped>
.editor-field__limit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  margin-top: 4px;
  color: #6b7688;
  font-size: 11.5px;
  line-height: 1.45;
}

.editor-field__counter {
  flex: 0 0 auto;
  color: #8591a2;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  text-align: right;
}
</style>
