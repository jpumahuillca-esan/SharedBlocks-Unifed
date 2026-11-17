<template>
  <div class="card-intl-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Apariencia</h6>
    <EditorBrandColor
      v-model="localData.panelColorToken"
      data-edit-target="panelColorToken"
      label="Color de la tarjeta"
      class="mb-3"
    />

    <hr />

    <h6 class="fw-bold small text-uppercase mb-1">Contenido principal</h6>
    <EditorText
      v-model="localData.title"
      data-edit-target="title"
      label="Título"
      placeholder="Internacionalización"
      class="mb-2"
    />

    <EditorTextarea
      v-model="localData.desc"
      data-edit-target="desc"
      label="Descripción"
      :rows="3"
      placeholder="Tenemos más de 130 convenios internacionales..."
      hint="Puedes resaltar cifras importantes con <strong>...</strong>."
      class="mb-3"
    />

    <EditorImage
      v-model="localData.image"
      v-model:alt="localData.imageAlt"
      label="Imagen principal"
      noun="imagen"
      :focus-values="localData.imageFocusProfiles"
      :focus-modes="imageFocusModes"
      :focus-height="130"
      focus-crop-preview
      :focus-sliders="false"
      alt-only-with-image
      alt-label="Texto alternativo de la imagen"
      alt-placeholder="Estudiantes de intercambio internacional ESAN"
      data-edit-target="image"
      alt-edit-target="imageAlt"
      class="mb-3"
      @select="$emit('select-image', { item: localData, field: 'image' })"
      @update:focus-values="saveImageFocusProfiles(localData, $event)"
      @remove="resetImageExtras"
    />

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Beneficios / Estadísticas</h6>
      <button
        type="button"
        class="btn btn-sm btn-outline-primary py-0 px-2"
        @click="addItem"
      >
        + Agregar
      </button>
    </div>
    <EditorHint>
      Se muestran en columnas dentro de la tarjeta destacada (ideal entre 2 y 4 ítems).
    </EditorHint>

    <CardAccordionItem
      v-for="(item, index) in localData.items"
      :key="item.id || index"
      :edit-key="`items.${index}`"
      :title="item.text || `Beneficio ${index + 1}`"
      :index="index"
      :total="localData.items?.length ?? 0"
      :open="openIndex === index"
      item-label="Beneficio"
      @toggle="toggleItem(index)"
      @move="moveItem(index, $event)"
      @remove="removeItem(index)"
    >
      <div class="mb-2">
        <label class="form-label mb-1">Ícono</label>
        <div class="d-flex align-items-center gap-2">
          <div class="card-intl-editor__icon-preview">
            <img
              v-if="resolveBuiltinIcon(item.icon)"
              :src="resolveBuiltinIcon(item.icon)"
              alt=""
              aria-hidden="true"
            />
            <AtomIcon
              v-else-if="item.icon"
              :name="item.icon"
              :size="18"
              aria-hidden="true"
            />
          </div>
          <select v-model="item.icon" class="form-select form-select-sm flex-grow-1">
            <option
              v-for="opt in CARD_INTERNATIONAL_ICON_OPTIONS"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
            <option
              v-if="item.icon && !isKnownOption(item.icon)"
              :value="item.icon"
            >
              Personalizado ({{ item.icon }})
            </option>
          </select>
        </div>
      </div>

      <EditorTextarea
        v-model="item.text"
        data-edit-target=".text"
        label="Texto del beneficio"
        :rows="2"
        placeholder="Ej. +130 Intercambios internacionales"
      />
    </CardAccordionItem>

    <hr />

    <h6 class="fw-bold small text-uppercase mb-1">Botón de acción</h6>
    <EditorText
      v-model="localData.buttonText"
      data-edit-target="buttonText"
      label="Texto del botón"
      placeholder="Ver más de Internacionalización"
      class="mb-2"
    />

    <EditorUrl
      v-model="localData.buttonLink"
      v-model:target="localData.buttonTarget"
      :sections="availableSections"
      data-edit-target="buttonLink"
      label="Enlace del botón"
      placeholder="/internacionalizacion o #pregrado"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import EditorBrandColor from '../../../editor-beta/EditorBrandColor/EditorBrandColor.vue';
import EditorHint from '../../../editor-beta/EditorHint/EditorHint.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import {
  createImageFocusModes,
  normalizeImageFocusProfiles,
  saveImageFocusProfiles,
} from '../../../../helpers/imageFocus';
import {
  CARD_INTERNATIONAL_ICON_OPTIONS,
  normalizeCardInternationalData,
  tokenToLegacyBackgroundHex,
  type CardInternationalData,
} from './shared/types';

import iconPinGlobe from '../../../../assets/images/icon-pin-globe.svg';
import iconHandshake from '../../../../assets/images/icon-handshake.svg';
import iconGradCap from '../../../../assets/images/icon-grad-cap.svg';
import iconAlumniGroup from '../../../../assets/images/icon-alumni-group.svg';

const BUILTIN_ICONS: Record<string, string> = {
  'pin-globe': iconPinGlobe,
  'ubicaciones': iconPinGlobe,
  'handshake': iconHandshake,
  'acuerdo': iconHandshake,
  'grad-cap': iconGradCap,
  'graduacion': iconGradCap,
  'alumni-group': iconAlumniGroup,
  'icon-alumni': iconAlumniGroup,
};

interface AvailableSectionOption {
  id: string;
  title?: string;
  type?: string;
  sectionId?: string;
}

const props = defineProps<{
  modelValue?: Partial<CardInternationalData>;
  availableSections?: AvailableSectionOption[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: CardInternationalData): void;
  (e: 'select-image', payload: { item: any; field: string }): void;
}>();

const imageFocusModes = createImageFocusModes({
  web: '1200 / 320',
  tablet: '16 / 9',
  mobile: '16 / 9',
});

const localData = ref<CardInternationalData>(normalizeCardInternationalData(props.modelValue));
const openIndex = ref<number | null>(0);

const resolveBuiltinIcon = (iconName?: string) => {
  if (!iconName) return '';
  if (BUILTIN_ICONS[iconName]) return BUILTIN_ICONS[iconName];
  if (iconName.startsWith('/') || iconName.startsWith('http') || iconName.endsWith('.svg') || iconName.endsWith('.png')) {
    return iconName;
  }
  return '';
};

const isKnownOption = (value?: string) =>
  Boolean(value && CARD_INTERNATIONAL_ICON_OPTIONS.some((opt) => opt.value === value));

const resetImageExtras = () => {
  localData.value.imageAlt = '';
  localData.value.imageFocusX = 50;
  localData.value.imageFocusY = 30;
  localData.value.imageFocusProfiles = normalizeImageFocusProfiles(undefined, 50, 30);
};

const toggleItem = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addItem = () => {
  if (!Array.isArray(localData.value.items)) {
    localData.value.items = [];
  }
  localData.value.items.push({
    id: `item-${Date.now()}`,
    icon: 'pin-globe',
    text: 'Nuevo beneficio internacional',
  });
  openIndex.value = localData.value.items.length - 1;
};

const moveItem = (index: number, delta: -1 | 1) => {
  const items = localData.value.items;
  if (!items) return;
  const targetIndex = index + delta;
  if (targetIndex < 0 || targetIndex >= items.length) return;
  const [moved] = items.splice(index, 1);
  items.splice(targetIndex, 0, moved);
  if (openIndex.value === index) openIndex.value = targetIndex;
};

const removeItem = (index: number) => {
  const items = localData.value.items;
  if (!items) return;
  items.splice(index, 1);
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};

watch(
  () => localData.value.panelColorToken,
  (token) => {
    const legacyHex = tokenToLegacyBackgroundHex(token);
    if (legacyHex) {
      localData.value.backgroundColor = legacyHex;
    }
  },
);

watch(
  () => props.modelValue,
  (newVal) => {
    const normalized = normalizeCardInternationalData(newVal);
    if (JSON.stringify(normalized) === JSON.stringify(localData.value)) return;
    localData.value = normalized;
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
.card-intl-editor__icon-preview {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: #17245e;
  color: #fff;
}

.card-intl-editor__icon-preview img {
  width: 18px;
  height: 18px;
  object-fit: contain;
}
</style>
