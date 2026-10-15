<template>
  <div class="editor-icon" :class="$attrs.class" :style="$attrs.style as any">
    <EditorText
      v-model="model"
      v-bind="controlAttrsOf($attrs)"
      :label="label"
      :list="listId"
      :placeholder="placeholder"
      :hint="unknown ? 'Ese ícono no existe en el catálogo: no se dibujará. Elige uno de la lista.' : hint"
      :hint-tone="unknown ? 'warn' : 'default'"
      hint-position="bottom"
    />
    <datalist :id="listId">
      <option v-for="name in ICON_SUGGESTIONS" :key="name" :value="name" />
    </datalist>

    <!-- La posición solo importa con un ícono elegido. -->
    <div
      v-if="withPosition && model"
      class="btn-group w-100 mt-2"
      role="group"
      aria-label="Posición del ícono"
    >
      <button
        v-for="option in POSITION_OPTIONS"
        :key="option.value"
        type="button"
        class="btn btn-sm"
        :class="position === option.value ? 'btn-secondary' : 'btn-outline-secondary'"
        :aria-pressed="position === option.value"
        @click="position = option.value"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Selector de ícono del panel de edición.
 *
 * Guarda el NOMBRE del ícono (`arrow-right`), el mismo que entiende AtomIcon.
 * Las sugerencias salen de helpers/iconOptions.ts, que lista el catálogo de
 * AtomIcon; un nombre que no esté ahí no dibuja nada, y el campo lo avisa.
 *
 * Con `with-position` y `v-model:position` pregunta además si el ícono va antes
 * o después del texto (`'start'` | `'end'`); sin ícono elegido no lo muestra.
 *
 * `class`/`style` a la raíz; el resto de atributos (`data-edit-target`) al
 * `<input>`, como en los demás átomos. Ver fieldUtils.ts.
 */
import { computed } from 'vue';
import EditorText from '../EditorText/EditorText.vue';
import { controlAttrsOf, nextFieldId } from '../_shared/fieldUtils';
import { ICON_SUGGESTIONS } from '../../../helpers/iconOptions';

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<{
  label?: string;
  hint?: string;
  placeholder?: string;
  /** Muestra el selector antes/después del texto (requiere `v-model:position`). */
  withPosition?: boolean;
}>(), { label: 'Ícono', placeholder: 'arrow-right' });

const model = defineModel<string>({ default: '' });
const position = defineModel<'start' | 'end'>('position', { default: 'end' });

const POSITION_OPTIONS: Array<{ value: 'start' | 'end'; label: string }> = [
  { value: 'start', label: 'Antes del texto' },
  { value: 'end', label: 'Después del texto' },
];

const listId = nextFieldId('ed-icon-list');

const unknown = computed(() => Boolean(model.value) && !ICON_SUGGESTIONS.includes(model.value.trim()));
</script>
