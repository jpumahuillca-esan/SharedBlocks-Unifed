<template>
  <div class="editor-pictogram" :class="$attrs.class" :style="$attrs.style as any">
    <EditorFieldShell
      :label="label"
      :field-id="triggerId"
      :hint="hint"
      hint-position="bottom"
    >
      <div class="editor-pictogram__control">
        <button
          :id="triggerId"
          type="button"
          class="editor-pictogram__current"
          :class="{ 'is-open': isOpen }"
          :aria-expanded="isOpen"
          v-bind="controlAttrsOf($attrs)"
          @click="togglePicker"
        >
          <span
            class="editor-pictogram__preview"
            :class="[
              `is-${previewSurface}`,
              { 'is-empty': !currentSvg },
            ]"
            aria-hidden="true"
            v-html="currentSvg"
          ></span>

          <span class="editor-pictogram__current-content">
            <strong>{{ currentShortTitle }}</strong>
            <small>{{ currentSubtitle }}</small>
          </span>

          <span class="editor-pictogram__current-action">
            <span>{{ isOpen ? 'Cerrar' : cleanValue ? 'Cambiar' : 'Elegir' }}</span>
            <i class="las la-angle-down" :class="{ 'is-open': isOpen }" aria-hidden="true"></i>
          </span>
        </button>

        <button
          v-if="optional && cleanValue"
          type="button"
          class="editor-pictogram__clear"
          title="Quitar pictograma"
          aria-label="Quitar pictograma"
          @click="clearPictogram"
        >
          <i class="las la-times" aria-hidden="true"></i>
        </button>
      </div>

      <div v-if="isOpen" class="editor-pictogram__panel">
        <div class="editor-pictogram__search-wrap">
          <i class="las la-search editor-pictogram__search-icon" aria-hidden="true"></i>
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="search"
            class="form-control form-control-sm editor-pictogram__search"
            placeholder="Buscar pictograma (ej: avion, laptop, medalla, birrete...)"
            aria-label="Buscar pictograma"
          />
          <button
            v-if="optional && cleanValue"
            type="button"
            class="editor-pictogram__none-btn"
            @click="clearPictogram"
          >
            Sin pictograma
          </button>
        </div>

        <div v-if="filteredPictograms.length" class="editor-pictogram__grid" role="listbox" :aria-label="label">
          <button
            v-for="item in filteredPictograms"
            :key="item.value"
            type="button"
            class="editor-pictogram__tile"
            :class="{ 'is-active': cleanValue === item.value }"
            :title="item.label"
            :aria-label="item.label"
            :aria-selected="cleanValue === item.value"
            @mouseenter="hoveredItem = item"
            @mouseleave="hoveredItem = null"
            @click="selectPictogram(item.value)"
          >
            <span
              class="editor-pictogram__tile-svg"
              :class="`is-${previewSurface}`"
              aria-hidden="true"
              v-html="item.svg"
            ></span>
            <span class="editor-pictogram__tile-name">{{ item.shortLabel }}</span>
          </button>
        </div>

        <div v-else class="editor-pictogram__empty">
          No se encontraron pictogramas para "{{ searchQuery.trim() }}".
        </div>

        <div class="editor-pictogram__footer">
          <span class="editor-pictogram__caption">
            {{ footerText }}
          </span>
        </div>
      </div>
    </EditorFieldShell>
  </div>
</template>

<script setup lang="ts">
/**
 * Selector visual de pictogramas de marca (helpers/pictograms.ts).
 *
 * Muestra todos los SVG directamente en una grilla clicable con etiqueta corta
 * y buscador, siguiendo la misma estética que EditorIcon y EditorBrandColor.
 */
import { computed, nextTick, ref } from 'vue';
import EditorFieldShell from '../EditorFieldShell/EditorFieldShell.vue';
import { controlAttrsOf, nextFieldId } from '../_shared/fieldUtils';
import { PICTOGRAMS, getPictogramSvg } from '../../../helpers/pictograms';

interface PictogramPickerEntry {
  value: string;
  label: string;
  shortLabel: string;
  svg: string;
  searchBlob: string;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    label?: string;
    hint?: string;
    optional?: boolean;
    /** `dark` para fondos oscuros como WhyChooseBand; `light` para fondos claros. */
    previewSurface?: 'light' | 'dark';
  }>(),
  {
    label: 'Pictograma',
    optional: true,
    previewSurface: 'light',
  },
);

const model = defineModel<string>({ default: '' });

const triggerId = nextFieldId('ed-picto');
const isOpen = ref(false);
const searchQuery = ref('');
const hoveredItem = ref<PictogramPickerEntry | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);

const allPictograms: PictogramPickerEntry[] = Object.entries(PICTOGRAMS).map(([value, def]) => {
  const shortLabel = def.label.split('—')[0].trim();
  return {
    value,
    label: def.label,
    shortLabel,
    svg: def.svg,
    searchBlob: `${value} ${def.label}`.toLowerCase(),
  };
});

const pictogramMap = new Map<string, PictogramPickerEntry>(
  allPictograms.map((item) => [item.value, item]),
);

const cleanValue = computed(() => (model.value || '').trim());
const currentEntry = computed(() => pictogramMap.get(cleanValue.value));
const currentSvg = computed(() => getPictogramSvg(cleanValue.value));

const currentShortTitle = computed(() => {
  if (!cleanValue.value) return 'Sin pictograma';
  return currentEntry.value?.shortLabel || cleanValue.value;
});

const currentSubtitle = computed(() => {
  if (!cleanValue.value) {
    return props.optional ? 'Opcional · elige un pictograma visualmente' : 'Haz clic para elegir';
  }
  return currentEntry.value?.label || cleanValue.value;
});

const filteredPictograms = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return allPictograms;
  return allPictograms.filter((item) => item.searchBlob.includes(q));
});

const footerText = computed(() => {
  if (hoveredItem.value) return hoveredItem.value.label;
  if (currentEntry.value) return currentEntry.value.label;
  return `${allPictograms.length} pictogramas de marca disponibles`;
});

const togglePicker = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick();
    searchInputRef.value?.focus();
  }
};

const selectPictogram = (value: string) => {
  model.value = value;
  isOpen.value = false;
  hoveredItem.value = null;
};

const clearPictogram = () => {
  model.value = '';
  isOpen.value = false;
  hoveredItem.value = null;
};
</script>

<style scoped>
.editor-pictogram {
  width: 100%;
}

.editor-pictogram__control {
  display: flex;
  align-items: stretch;
  gap: 6px;
  width: 100%;
}

.editor-pictogram__current {
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
  align-items: center;
  gap: 10px;
  padding: 7px 10px;
  border: 1px solid #d7dde6;
  border-radius: 7px;
  background: #ffffff;
  color: #1f2733;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.editor-pictogram__current:hover,
.editor-pictogram__current.is-open {
  border-color: #aab4c2;
  background: #f8f9fb;
}

.editor-pictogram__preview {
  display: inline-flex;
  flex: 0 0 36px;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 5px;
  border: 1px solid #dde3ec;
  border-radius: 6px;
  box-sizing: border-box;
}

.editor-pictogram__preview.is-light {
  background: #ffffff;
  color: #e3173e;
}

.editor-pictogram__preview.is-dark {
  background: #1a2b3c;
  border-color: #1a2b3c;
  color: #ffffff;
}

.editor-pictogram__preview.is-empty {
  border-style: dashed;
  background: #f4f6fa;
  border-color: #cbd5e1;
}

.editor-pictogram__preview :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.editor-pictogram__current-content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
}

.editor-pictogram__current-content strong {
  overflow: hidden;
  color: #1f2733;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.editor-pictogram__current-content small {
  overflow: hidden;
  margin-top: 1px;
  color: #778292;
  font-size: 10.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.editor-pictogram__current-action {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 5px;
  color: #6b7688;
  font-size: 10.5px;
  font-weight: 600;
}

.editor-pictogram__current-action i {
  font-size: 11px;
  transition: transform 0.15s ease;
}

.editor-pictogram__current-action i.is-open {
  transform: rotate(180deg);
}

.editor-pictogram__clear {
  display: inline-flex;
  flex: 0 0 34px;
  align-items: center;
  justify-content: center;
  border: 1px solid #d7dde6;
  border-radius: 7px;
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
}

.editor-pictogram__clear:hover {
  border-color: #e3173e;
  background: #fff5f6;
  color: #e3173e;
}

.editor-pictogram__panel {
  margin-top: 8px;
  padding: 10px;
  border: 1px solid #dde3ec;
  border-radius: 7px;
  background: #f8f9fb;
}

.editor-pictogram__search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.editor-pictogram__search-icon {
  position: absolute;
  top: 50%;
  left: 9px;
  transform: translateY(-50%);
  color: #8591a2;
  font-size: 13px;
  pointer-events: none;
}

.editor-pictogram__search {
  flex: 1 1 auto;
  padding-left: 28px;
  font-size: 12px;
}

.editor-pictogram__none-btn {
  flex: 0 0 auto;
  padding: 4px 8px;
  border: 1px solid #d7dde6;
  border-radius: 6px;
  background: #ffffff;
  color: #475569;
  font-size: 10.5px;
  font-weight: 600;
  cursor: pointer;
}

.editor-pictogram__none-btn:hover {
  border-color: #e3173e;
  color: #e3173e;
}

.editor-pictogram__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(66px, 1fr));
  gap: 6px;
  max-height: 240px;
  padding: 2px;
  overflow-y: auto;
}

.editor-pictogram__tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 4px;
  border: 1px solid #dde3ec;
  border-radius: 7px;
  background: #ffffff;
  color: #334155;
  cursor: pointer;
  transition: border-color 0.12s ease, background-color 0.12s ease;
}

.editor-pictogram__tile:hover {
  border-color: #94a3b8;
  background: #f1f5f9;
}

.editor-pictogram__tile.is-active {
  border-color: #e3173e;
  background: #fff1f3;
}

.editor-pictogram__tile-svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 4px;
  border-radius: 6px;
  box-sizing: border-box;
}

.editor-pictogram__tile-svg.is-light {
  color: #e3173e;
}

.editor-pictogram__tile-svg.is-dark {
  background: #1a2b3c;
  color: #ffffff;
}

.editor-pictogram__tile-svg :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.editor-pictogram__tile-name {
  width: 100%;
  overflow: hidden;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.editor-pictogram__empty {
  padding: 16px 8px;
  color: #64748b;
  font-size: 11.5px;
  text-align: center;
}

.editor-pictogram__footer {
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid #e2e8f0;
}

.editor-pictogram__caption {
  display: block;
  overflow: hidden;
  color: #64748b;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
