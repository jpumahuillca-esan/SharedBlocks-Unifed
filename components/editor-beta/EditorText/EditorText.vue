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
    <input
      v-bind="controlAttrsOf($attrs)"
      :id="fieldId"
      v-model="model"
      type="text"
      class="form-control form-control-sm"
      :maxlength="maxlength"
      :placeholder="placeholder"
    />
  </EditorFieldShell>
</template>

<script setup lang="ts">
/**
 * Campo de texto de una línea del panel de edición.
 *
 * `class` y `style` van a la raíz (el margen: `class="mb-2"`); el resto de
 * atributos, `data-edit-target` incluido, al `<input>`. Ver fieldUtils.ts.
 *
 * Con `maxlength` pone el tope al campo y dibuja el contador.
 */
import { computed } from 'vue';
import EditorFieldShell from '../EditorFieldShell/EditorFieldShell.vue';
import { controlAttrsOf, nextFieldId } from '../_shared/fieldUtils';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{
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
}>(), { counter: true });

const model = defineModel<string>({ default: '' });

const autoId = nextFieldId('ed-text');
const fieldId = computed(() => props.id || autoId);
</script>
