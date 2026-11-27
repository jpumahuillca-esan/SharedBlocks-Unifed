<template>
  <div class="editor-icon" :class="$attrs.class" :style="$attrs.style as any">
    <EditorFieldShell
      :label="label"
      :field-id="triggerId"
      :hint="effectiveHint"
      :hint-tone="isUnknown ? 'warn' : 'default'"
      hint-position="bottom"
    >
      <div class="editor-icon__control">
        <button
          :id="triggerId"
          type="button"
          class="editor-icon__current"
          :class="{ 'is-open': isOpen, 'is-empty': !cleanValue }"
          :aria-expanded="isOpen"
          v-bind="controlAttrsOf($attrs)"
          @click="togglePicker"
        >
          <span
            class="editor-icon__preview"
            :class="{ 'is-empty': !cleanValue || isUnknown }"
            aria-hidden="true"
          >
            <AtomIcon v-if="cleanValue && !isUnknown" :name="cleanValue" :size="19" />
            <i v-else class="las la-icons"></i>
          </span>

          <span class="editor-icon__current-content">
            <strong>{{ currentTitle }}</strong>
            <small>{{ currentSubtitle }}</small>
          </span>

          <span class="editor-icon__current-action">
            <span>{{ isOpen ? 'Cerrar' : cleanValue ? 'Cambiar' : 'Elegir' }}</span>
            <i class="las la-angle-down" :class="{ 'is-open': isOpen }" aria-hidden="true"></i>
          </span>
        </button>

        <button
          v-if="optional && cleanValue"
          type="button"
          class="editor-icon__clear"
          title="Quitar ícono"
          aria-label="Quitar ícono"
          @click="clearIcon"
        >
          <i class="las la-times" aria-hidden="true"></i>
        </button>
      </div>

      <div v-if="isOpen" class="editor-icon__panel">
        <div class="editor-icon__search-wrap">
          <i class="las la-search editor-icon__search-icon" aria-hidden="true"></i>
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="search"
            class="form-control form-control-sm editor-icon__search"
            placeholder="Buscar (ej: birrete, laptop, reloj, usuario, check...)"
            aria-label="Buscar ícono en la librería"
          />
        </div>

        <div class="editor-icon__scopes" role="tablist" aria-label="Alcance de búsqueda de íconos">
          <button
            type="button"
            class="editor-icon__scope-btn"
            :class="{ 'is-active': scope === 'curated' }"
            @click="setScope('curated')"
          >
            Sugeridos ({{ curatedCount }})
          </button>
          <button
            type="button"
            class="editor-icon__scope-btn"
            :class="{ 'is-active': scope === 'all' }"
            @click="setScope('all')"
          >
            Librería Lucide{{ totalLibraryCount ? ` (${totalLibraryCount})` : '' }}
          </button>
          <button
            v-if="optional && cleanValue"
            type="button"
            class="editor-icon__none-btn ms-auto"
            @click="clearIcon"
          >
            Sin ícono
          </button>
        </div>

        <div v-if="scope === 'curated' && !searchQuery.trim()" class="editor-icon__categories">
          <button
            v-for="cat in ICON_CATEGORIES"
            :key="cat"
            type="button"
            class="editor-icon__cat-pill"
            :class="{ 'is-active': activeCategory === cat }"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <div v-if="isLoadingLibrary && scope === 'all' && !allLibraryEntries.length" class="editor-icon__loading">
          Cargando galería de Lucide...
        </div>

        <div v-else-if="visibleIcons.length" class="editor-icon__grid" role="listbox" :aria-label="label">
          <button
            v-for="entry in visibleIcons"
            :key="entry.name"
            type="button"
            class="editor-icon__tile"
            :class="{ 'is-active': cleanValue === entry.name }"
            :title="`${entry.label} (${entry.name})`"
            :aria-label="`${entry.label} (${entry.name})`"
            :aria-selected="cleanValue === entry.name"
            @mouseenter="hoveredEntry = entry"
            @mouseleave="hoveredEntry = null"
            @click="selectIcon(entry.name)"
          >
            <AtomIcon :name="entry.name" :size="19" />
          </button>
        </div>

        <div v-else class="editor-icon__empty">
          No se encontraron íconos para "{{ searchQuery.trim() }}".
        </div>

        <div class="editor-icon__footer">
          <span class="editor-icon__caption" :title="footerTooltip">
            {{ footerLabel }}
          </span>
          <button
            v-if="hasMoreIcons"
            type="button"
            class="btn btn-link btn-sm p-0 editor-icon__more"
            @click="visibleLimit += PAGE_SIZE"
          >
            Ver más ({{ filteredIcons.length - visibleIcons.length }})
          </button>
        </div>
      </div>

      <!-- La posición solo importa con un ícono elegido. -->
      <div
        v-if="withPosition && cleanValue"
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
    </EditorFieldShell>
  </div>
</template>

<script setup lang="ts">
/**
 * Selector visual de íconos Lucide para el panel inspector.
 *
 * Muestra vista previa real con AtomIcon, búsqueda en español e inglés,
 * filtro por categorías sugeridas y acceso bajo demanda a toda la librería
 * @lucide/vue (~1,800 íconos) sin exigir memorizar nombres técnicos.
 */
import { computed, nextTick, ref, watch } from 'vue';
import AtomIcon from '../../atoms/AtomIcon.vue';
import EditorFieldShell from '../EditorFieldShell/EditorFieldShell.vue';
import { controlAttrsOf, nextFieldId } from '../_shared/fieldUtils';
import {
  ICON_CATALOG,
  ICON_CATEGORIES,
  findIconCatalogItem,
  type IconCategory,
} from '../../../helpers/iconOptions';
import {
  ensureLucideLibraryLoaded,
  formatLucideHumanLabel,
  getDynamicLucideIcon,
  getLucideLibraryEntries,
  isLucideLibraryLoaded,
  type DynamicLucideEntry,
} from '../../../helpers/lucideDynamic';

interface PickerEntry {
  name: string;
  label: string;
  category?: IconCategory;
  searchBlob: string;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    label?: string;
    hint?: string;
    placeholder?: string;
    /** Permite dejar el campo vacío con el botón Quitar / Sin ícono. */
    optional?: boolean;
    /** Muestra el selector antes/después del texto (requiere `v-model:position`). */
    withPosition?: boolean;
  }>(),
  {
    label: 'Ícono',
    optional: true,
    withPosition: false,
  },
);

const model = defineModel<string>({ default: '' });
const position = defineModel<'start' | 'end'>('position', { default: 'end' });

const PAGE_SIZE = 72;

const POSITION_OPTIONS: Array<{ value: 'start' | 'end'; label: string }> = [
  { value: 'start', label: 'Antes del texto' },
  { value: 'end', label: 'Después del texto' },
];

const triggerId = nextFieldId('ed-icon');
const isOpen = ref(false);
const scope = ref<'curated' | 'all'>('curated');
const activeCategory = ref<'Todas' | IconCategory>('Todas');
const searchQuery = ref('');
const visibleLimit = ref(PAGE_SIZE);
const isLoadingLibrary = ref(false);
const libraryLoadedTick = ref(0);
const hoveredEntry = ref<PickerEntry | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);

const cleanValue = computed(() => (model.value || '').trim().toLowerCase());

const curatedEntries: PickerEntry[] = ICON_CATALOG.map((item) => ({
  name: item.name,
  label: item.label,
  category: item.category,
  searchBlob: `${item.name} ${item.label} ${item.category} ${item.keywords}`.toLowerCase(),
}));

const curatedMap = new Map<string, PickerEntry>(curatedEntries.map((item) => [item.name, item]));
const curatedCount = curatedEntries.length;

const allLibraryEntries = computed<DynamicLucideEntry[]>(() => {
  void libraryLoadedTick.value;
  return getLucideLibraryEntries();
});

const totalLibraryCount = computed(() => allLibraryEntries.value.length);

const loadFullLibrary = async () => {
  if (isLucideLibraryLoaded()) {
    libraryLoadedTick.value += 1;
    return;
  }
  isLoadingLibrary.value = true;
  try {
    await ensureLucideLibraryLoaded();
    libraryLoadedTick.value += 1;
  } catch {
    // Si falla el chunk opcional, seguimos mostrando los 119 íconos curados.
  } finally {
    isLoadingLibrary.value = false;
  }
};

const normalizedFullEntries = computed<PickerEntry[]>(() => {
  return allLibraryEntries.value.map((entry) => {
    const curated = curatedMap.get(entry.name);
    if (curated) return curated;
    return {
      name: entry.name,
      label: entry.label,
      searchBlob: `${entry.name} ${entry.label} ${entry.pascal}`.toLowerCase(),
    };
  });
});

const filteredIcons = computed<PickerEntry[]>(() => {
  const q = searchQuery.value.trim().toLowerCase();

  if (q) {
    const curatedMatches = curatedEntries.filter((item) => item.searchBlob.includes(q));
    if (!allLibraryEntries.value.length) return curatedMatches;

    const seen = new Set(curatedMatches.map((item) => item.name));
    const libraryMatches = normalizedFullEntries.value.filter(
      (item) => !seen.has(item.name) && item.searchBlob.includes(q),
    );
    return [...curatedMatches, ...libraryMatches];
  }

  if (scope.value === 'all') {
    return normalizedFullEntries.value.length ? normalizedFullEntries.value : curatedEntries;
  }

  if (activeCategory.value === 'Todas') {
    return curatedEntries;
  }

  return curatedEntries.filter((item) => item.category === activeCategory.value);
});

const visibleIcons = computed(() => filteredIcons.value.slice(0, visibleLimit.value));
const hasMoreIcons = computed(() => filteredIcons.value.length > visibleIcons.value.length);

const currentCatalogMeta = computed(() => findIconCatalogItem(cleanValue.value));

const isUnknown = computed(() => {
  const val = cleanValue.value;
  if (!val) return false;
  if (currentCatalogMeta.value) return false;
  void libraryLoadedTick.value;
  if (!isLucideLibraryLoaded()) return false;
  return getDynamicLucideIcon(val) === null;
});

const currentTitle = computed(() => {
  if (!cleanValue.value) return 'Sin ícono';
  if (currentCatalogMeta.value) return currentCatalogMeta.value.label;
  return formatLucideHumanLabel(cleanValue.value);
});

const currentSubtitle = computed(() => {
  if (!cleanValue.value) {
    return props.optional ? 'Opcional · elige un ícono visualmente' : 'Haz clic para elegir';
  }
  return currentCatalogMeta.value
    ? `${currentCatalogMeta.value.category} · ${cleanValue.value}`
    : cleanValue.value;
});

const effectiveHint = computed(() => {
  if (isUnknown.value) {
    return 'Ese ícono no existe en @lucide/vue. Elige uno de la galería.';
  }
  return props.hint;
});

const footerLabel = computed(() => {
  if (hoveredEntry.value) {
    return `${hoveredEntry.value.label} (${hoveredEntry.value.name})`;
  }
  if (cleanValue.value) {
    return `${currentTitle.value} (${cleanValue.value})`;
  }
  return `${filteredIcons.value.length} íconos disponibles`;
});

const footerTooltip = computed(() => hoveredEntry.value?.name || cleanValue.value || '');

const togglePicker = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    void loadFullLibrary();
    await nextTick();
    searchInputRef.value?.focus();
  }
};

const setScope = (next: 'curated' | 'all') => {
  scope.value = next;
  visibleLimit.value = PAGE_SIZE;
  if (next === 'all') {
    void loadFullLibrary();
  }
};

const selectIcon = (name: string) => {
  model.value = name;
  isOpen.value = false;
  hoveredEntry.value = null;
};

const clearIcon = () => {
  model.value = '';
  isOpen.value = false;
  hoveredEntry.value = null;
};

watch([searchQuery, activeCategory], () => {
  visibleLimit.value = PAGE_SIZE;
});

watch(
  cleanValue,
  (val) => {
    if (val && !findIconCatalogItem(val) && !isLucideLibraryLoaded()) {
      void loadFullLibrary();
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.editor-icon {
  width: 100%;
}

.editor-icon__control {
  display: flex;
  align-items: stretch;
  gap: 6px;
  width: 100%;
}

.editor-icon__current {
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
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.editor-icon__current:hover,
.editor-icon__current.is-open {
  border-color: #aab4c2;
  background: #f8f9fb;
}

.editor-icon__preview {
  display: inline-flex;
  flex: 0 0 32px;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #dde3ec;
  border-radius: 6px;
  background: #f8fafc;
  color: #0f172a;
}

.editor-icon__preview.is-empty {
  border-style: dashed;
  color: #94a3b8;
}

.editor-icon__current-content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
}

.editor-icon__current-content strong {
  overflow: hidden;
  color: #1f2733;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.editor-icon__current-content small {
  overflow: hidden;
  margin-top: 1px;
  color: #778292;
  font-size: 10.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.editor-icon__current-action {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 5px;
  color: #6b7688;
  font-size: 10.5px;
  font-weight: 600;
}

.editor-icon__current-action i {
  font-size: 11px;
  transition: transform 0.15s ease;
}

.editor-icon__current-action i.is-open {
  transform: rotate(180deg);
}

.editor-icon__clear {
  display: inline-flex;
  flex: 0 0 34px;
  align-items: center;
  justify-content: center;
  border: 1px solid #d7dde6;
  border-radius: 7px;
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
  transition:
    color 0.15s ease,
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.editor-icon__clear:hover {
  border-color: #e3173e;
  background: #fff5f6;
  color: #e3173e;
}

.editor-icon__panel {
  margin-top: 8px;
  padding: 10px;
  border: 1px solid #dde3ec;
  border-radius: 7px;
  background: #f8f9fb;
}

.editor-icon__search-wrap {
  position: relative;
  margin-bottom: 8px;
}

.editor-icon__search-icon {
  position: absolute;
  top: 50%;
  left: 9px;
  transform: translateY(-50%);
  color: #8591a2;
  font-size: 13px;
  pointer-events: none;
}

.editor-icon__search {
  padding-left: 28px;
  font-size: 12px;
}

.editor-icon__scopes {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.editor-icon__scope-btn,
.editor-icon__none-btn,
.editor-icon__cat-pill {
  padding: 3px 8px;
  border: 1px solid #d7dde6;
  border-radius: 999px;
  background: #ffffff;
  color: #475569;
  font-size: 10.5px;
  font-weight: 600;
  line-height: 1.3;
  cursor: pointer;
  transition: all 0.15s ease;
}

.editor-icon__scope-btn.is-active,
.editor-icon__cat-pill.is-active {
  border-color: #1a2b3c;
  background: #1a2b3c;
  color: #ffffff;
}

.editor-icon__none-btn:hover {
  border-color: #e3173e;
  color: #e3173e;
}

.editor-icon__categories {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.editor-icon__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(38px, 1fr));
  gap: 5px;
  max-height: 224px;
  padding: 2px;
  overflow-y: auto;
}

.editor-icon__tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  border: 1px solid #dde3ec;
  border-radius: 6px;
  background: #ffffff;
  color: #334155;
  cursor: pointer;
  transition:
    border-color 0.12s ease,
    background-color 0.12s ease,
    color 0.12s ease,
    transform 0.12s ease;
}

.editor-icon__tile:hover {
  border-color: #94a3b8;
  background: #f1f5f9;
  color: #0f172a;
}

.editor-icon__tile.is-active {
  border-color: #e3173e;
  background: #fff1f3;
  color: #e3173e;
}

.editor-icon__loading,
.editor-icon__empty {
  padding: 18px 8px;
  color: #64748b;
  font-size: 11.5px;
  text-align: center;
}

.editor-icon__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid #e2e8f0;
}

.editor-icon__caption {
  overflow: hidden;
  color: #64748b;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.editor-icon__more {
  flex: 0 0 auto;
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
}
</style>
