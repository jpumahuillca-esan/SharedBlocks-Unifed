<template>
  <div class="awards-editor">
    <!-- Sin `card-count`: la fila muestra todos sus logos, no hay columnas que elegir. -->
    <CardSectionHeaderEditor
      :eyebrow="localData.eyebrow"
      eyebrow-label="Antetítulo"
      eyebrow-hint="Se muestra con un guion largo al inicio."
      :desc="localData.desc"
      :title="localData.title"
      :link-label="localData.linkLabel"
      :link-url="localData.linkUrl"
      :link-target="localData.linkTarget"
      @update:eyebrow="localData.eyebrow = $event"
      @update:desc="localData.desc = $event"
      @update:title="localData.title = $event"
      @update:link-label="localData.linkLabel = $event"
      @update:link-url="localData.linkUrl = $event"
      @update:link-target="localData.linkTarget = $event"
    >
      <template #title>
        <div class="awards-title-editor mb-2" data-edit-target="title">
          <label class="form-label">Título de la sección</label>
          <QuillEditor
            v-model:content="localData.title"
            content-type="html"
            theme="snow"
            :toolbar="titleToolbar"
            placeholder="Indicadores de excelencia ESAN"
          />
          <small class="text-muted">Selecciona una parte del título y elige su color.</small>
        </div>
      </template>
    </CardSectionHeaderEditor>

    <hr />

    <!-- Configuración de Fondo y Espaciado Superior -->
    <div class="mb-3">
      <h6 class="fw-bold small text-uppercase mb-2">Fondo y Espaciado</h6>

      <!-- Control de Color de Fondo -->
      <div class="mb-3" data-edit-target="backgroundColor">
        <label class="form-label mb-1">Color de fondo</label>
        <p class="aw-hint">
          Elige si la sección tiene fondo de color o se muestra transparente ("sin fondo").
        </p>
        <div class="d-flex align-items-center gap-2">
          <span
            class="aw-bg-preview"
            :class="{ 'aw-bg-preview--transparent': isTransparentBg }"
            :style="previewStyle"
            aria-hidden="true"
          ></span>
          <select
            v-model="selectedBgMode"
            class="form-select form-select-sm"
            @change="onBgModeChange"
          >
            <option
              v-for="bg in PRESET_BACKGROUNDS"
              :key="bg.value"
              :value="bg.value"
            >
              {{ bg.label }}
            </option>
            <option value="custom">Personalizado (Hex / Token)...</option>
          </select>
        </div>

        <div v-if="selectedBgMode === 'custom'" class="mt-2">
          <input
            v-model="customBgValue"
            type="text"
            class="form-control form-control-sm"
            placeholder="Ej: #F8FAFC o --ds-color-..."
            @input="onCustomBgInput"
          />
        </div>
      </div>

      <!-- Control de Espaciado Superior (Margin Top con Tokens) -->
      <div class="mb-3" data-edit-target="marginTopToken">
        <label class="form-label mb-1">Espaciado hacia arriba (Margin Top)</label>
        <p class="aw-hint">
          Separación externa superior (margin-top) con respecto al bloque de arriba. Permite juntar o distanciar este bloque del superior manteniendo el aire y lectura interna del texto.
        </p>
        <select
          v-model="localData.marginTopToken"
          class="form-select form-select-sm"
        >
          <option
            v-for="token in SPACING_TOKENS"
            :key="token.value"
            :value="token.value"
          >
            {{ token.label }}
          </option>
        </select>
      </div>
    </div>

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Reconocimientos</h6>
      <span class="badge bg-secondary">{{ localData.awards.length }} / {{ MAX_AWARDS }}</span>
    </div>
    <p class="aw-hint">
      Hasta {{ MAX_AWARDS }} logos. En escritorio se ven todos en una fila; en
      teléfono, dos a la vez y el resto deslizando. Mientras un reconocimiento
      no tenga imagen, en su lugar se ve un recuadro gris.
    </p>

    <CardAccordionItem
      v-for="(award, index) in localData.awards"
      :edit-key="`awards.${index}`"
      :key="award.id"
      :title="headLabel(award)"
      :index="index"
      :total="localData.awards.length"
      :open="openIndex === index"
      remove-label="Quitar reconocimiento"
      @toggle="toggle(index)"
      @move="moveAward(index, $event)"
      @remove="removeAward(index)"
    >
      <div>
        <!-- `contain`: un logo recortado deja de leerse. -->
        <EditorImage
          v-model="award.image"
          v-model:alt="award.imageAlt"
          data-edit-target=".image"
          alt-edit-target=".imageAlt"
          label="Logo"
          fit="contain"
          alt-hint="El nombre del reconocimiento, tal como se lee en el logo. Lo usan los buscadores y los lectores de pantalla."
          alt-hint-position="top"
          alt-placeholder="N.º 1 en QS Executive MBA Rankings 2026"
          @select="$emit('select-image', { item: award, field: 'image' })"
        />
      </div>
    </CardAccordionItem>

    <button
      type="button"
      class="btn btn-sm btn-danger w-100"
      :disabled="isFull"
      @click="addAward"
    >
      <i class="las la-plus me-1"></i>
      {{ isFull ? `Máximo ${MAX_AWARDS} reconocimientos` : 'Agregar reconocimiento' }}
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * Editor de los reconocimientos destacados.
 *
 * El encabezado es el mismo fragmento que usan las secciones de `events`. Cada
 * reconocimiento es solo un logo y su texto alternativo.
 */
import { ref, computed, watch } from 'vue';
import CardSectionHeaderEditor from '../../events/_shared/CardSectionHeaderEditor.vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import { normalizeLinkTarget } from '../../../../helpers/linkTarget';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

/** Tope de la maqueta. El bloque aplica el mismo (ver Block.vue). */
const MAX_AWARDS = 4;
const titleToolbar = [[{ color: ['#E3173E', '#4F5A6C', '#000000', false] }]];

interface AwardItem {
  id: string;
  image: string;
  imageAlt: string;
}

const props = defineProps<{
  modelValue: any;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);

const newAwardId = () => `aw-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const buildAward = (source: any): AwardItem => ({
  id: source?.id || newAwardId(),
  image: source?.image ?? '',
  imageAlt: source?.imageAlt ?? '',
});

const build = (source: any) => ({
  backgroundColor: source?.backgroundColor ?? 'transparent',
  marginTopToken: source?.marginTopToken ?? '',
  eyebrow: source?.eyebrow ?? '',
  title: source?.title ?? '',
  desc: source?.desc ?? '',
  linkLabel: source?.linkLabel ?? '',
  linkUrl: source?.linkUrl ?? '',
  linkTarget: normalizeLinkTarget(source?.linkTarget),
  awards: Array.isArray(source?.awards)
    ? source.awards.slice(0, MAX_AWARDS).map(buildAward)
    : [],
});

const PRESET_BACKGROUNDS = [
  { value: 'transparent', label: 'Sin fondo (Transparente)' },
  { value: '#E4E6ED', label: 'Gris Values Cards (#E4E6ED - Imagen 3)' },
  { value: '#F1F5F9', label: 'Gris Maqueta Logros / Neutral 100 (#F1F5F9 - Imagen 1)' },
  { value: 'var(--ds-color-background-default, #FFFFFF)', label: 'Blanco institucional (--ds-color-background-default)' },
  { value: 'var(--ds-color-background-light, #F4F6FA)', label: 'Gris claro institucional (--ds-color-background-light)' },
  { value: 'var(--ds-color-background-soft, #EAEFF5)', label: 'Gris suave (--ds-color-background-soft)' },
  { value: 'var(--ds-color-background-blend, #CBD5E1)', label: 'Gris neutro (--ds-color-background-blend)' },
  { value: '#F8FAFC', label: 'Gris tenue (#F8FAFC)' },
  { value: '#FFFFFF', label: 'Blanco puro (#FFFFFF)' },
];

const SPACING_TOKENS = [
  { value: '', label: 'Por defecto (Sin margen superior adicional)' },
  { value: '0', label: '0px (Sin separación superior)' },
  { value: '--ds-spacing-xxs', label: '--ds-spacing-xxs (8px)' },
  { value: '--ds-spacing-xs', label: '--ds-spacing-xs (12px)' },
  { value: '--ds-spacing-sm', label: '--ds-spacing-sm (20px / 16px móvil)' },
  { value: '--ds-spacing-md', label: '--ds-spacing-md (32px / 20px móvil)' },
  { value: '--ds-spacing-lg', label: '--ds-spacing-lg (48px / 24px móvil)' },
  { value: '--ds-spacing-xl', label: '--ds-spacing-xl (64px / 32px móvil)' },
  { value: '--ds-spacing-xxl', label: '--ds-spacing-xxl (80px / 48px móvil)' },
  { value: '--ds-spacing-xxxl', label: '--ds-spacing-xxxl (128px / 64px móvil)' },
];

const localData = ref(build(props.modelValue));

const isKnownPreset = (val: string) => PRESET_BACKGROUNDS.some((p) => p.value === val);

const selectedBgMode = ref(
  isKnownPreset(localData.value.backgroundColor) ? localData.value.backgroundColor : 'custom',
);
const customBgValue = ref(
  isKnownPreset(localData.value.backgroundColor) ? '' : localData.value.backgroundColor,
);

const isTransparentBg = computed(() => {
  const bg = localData.value.backgroundColor;
  return !bg || bg === 'transparent' || bg === 'none';
});

const previewStyle = computed(() => {
  const bg = localData.value.backgroundColor;
  if (!bg || bg === 'transparent' || bg === 'none') {
    return {};
  }
  return {
    backgroundColor: bg.startsWith('--') ? `var(${bg})` : bg,
  };
});

const onBgModeChange = () => {
  if (selectedBgMode.value === 'custom') {
    localData.value.backgroundColor = customBgValue.value || '#FFFFFF';
  } else {
    localData.value.backgroundColor = selectedBgMode.value;
  }
};

const onCustomBgInput = () => {
  localData.value.backgroundColor = customBgValue.value.trim();
};

const isFull = computed(() => localData.value.awards.length >= MAX_AWARDS);

/*
 * La cabecera de cada panel nombra el reconocimiento por su texto alternativo:
 * es lo único escrito que tiene. Sin él, dice qué le falta.
 */
const headLabel = (award: AwardItem) =>
  award.imageAlt.trim() || (award.image ? 'Sin texto alternativo' : 'Sin imagen');

/*
 * Acordeón de un solo panel abierto, como en el resto de editores de la
 * familia `events`.
 */
const openIndex = ref<number | null>(null);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addAward = () => {
  if (isFull.value) return;

  localData.value.awards.push(buildAward({}));
  // El reconocimiento nuevo se abre solo: es el que se va a rellenar.
  openIndex.value = localData.value.awards.length - 1;
};

const removeAward = (index: number) => {
  localData.value.awards.splice(index, 1);

  // El índice abierto se corrige para no quedar apuntando a otro reconocimiento.
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};

const moveAward = (index: number, delta: number) => {
  const target = index + delta;
  const list = localData.value.awards;
  if (target < 0 || target >= list.length) return;

  [list[index], list[target]] = [list[target], list[index]];

  // El panel abierto viaja con su reconocimiento.
  if (openIndex.value === index) openIndex.value = target;
  else if (openIndex.value === target) openIndex.value = index;
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) return;
    if (JSON.stringify(newVal) === JSON.stringify(localData.value)) return;
    localData.value = build(newVal);
    if (isKnownPreset(localData.value.backgroundColor)) {
      selectedBgMode.value = localData.value.backgroundColor;
      customBgValue.value = '';
    } else {
      selectedBgMode.value = 'custom';
      customBgValue.value = localData.value.backgroundColor;
    }
  },
  { deep: true },
);

watch(
  localData,
  (newVal) => emit('update:modelValue', JSON.parse(JSON.stringify(newVal))),
  { deep: true },
);
</script>

<style scoped>
.awards-title-editor :deep(.ql-toolbar.ql-snow) {
  border-radius: 4px 4px 0 0;
}

.awards-title-editor :deep(.ql-container.ql-snow) {
  min-height: 74px;
  border-radius: 0 0 4px 4px;
}

.awards-title-editor :deep(.ql-editor) {
  min-height: 74px;
  font-family: var(--ds-font-family-base);
}

.aw-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}

.aw-bg-preview {
  display: inline-block;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
  flex-shrink: 0;
  box-sizing: border-box;
}

.aw-bg-preview--transparent {
  background-color: #ffffff;
  background-image:
    linear-gradient(45deg, #e2e8f0 25%, transparent 25%),
    linear-gradient(-45deg, #e2e8f0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e2e8f0 75%),
    linear-gradient(-45deg, transparent 75%, #e2e8f0 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
}
</style>
