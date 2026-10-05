<template>
  <EditorFieldShell
    :class="$attrs.class"
    :style="$attrs.style as any"
    :label="label"
    :label-class="labelClass"
    :hint="hint"
    :hint-position="hintPosition"
    :hint-tone="hintTone"
    :field-id="fieldId"
    :maxlength="maxlength"
    :counter="counter"
    :length="String(model ?? '').length"
  >
    <textarea
      v-bind="controlAttrsOf($attrs)"
      :id="fieldId"
      v-model="model"
      class="form-control form-control-sm"
      :rows="rows"
      :maxlength="maxlength"
      :placeholder="placeholder"
    ></textarea>
  </EditorFieldShell>
</template>

<script setup lang="ts">
/**
 * Campo de texto de varias líneas del panel de edición. Mismo reparto de
 * atributos que EditorText.
 */
import { computed } from 'vue';
import EditorFieldShell from '../EditorFieldShell/EditorFieldShell.vue';
import { controlAttrsOf, nextFieldId } from '../_shared/fieldUtils';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    id?: string;
    label?: string;
    labelClass?: string;
    hint?: string;
    hintPosition?: 'top' | 'bottom';
    hintTone?: 'default' | 'warn';
    placeholder?: string;
    maxlength?: number;
    /** `false`: pone el tope sin dibujar el contador. */
    counter?: boolean;
    rows?: number;
  }>(),
  { rows: 2, counter: true },
);

const model = defineModel<string>({ default: '' });

const autoId = nextFieldId('ed-textarea');
const fieldId = computed(() => props.id || autoId);
</script>
