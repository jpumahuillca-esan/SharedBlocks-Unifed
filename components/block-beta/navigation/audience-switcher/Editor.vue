<template>
  <div class="audience-switcher-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Cabecera</h6>
    <EditorText
      v-model="localData.title"
      data-edit-target="title"
      label="Título de la sección"
      placeholder="¿En qué momento estás?"
      class="mb-3"
    />

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Tarjetas de audiencia</h6>
      <button
        type="button"
        class="btn btn-sm btn-outline-primary py-0 px-2"
        @click="addCard"
      >
        + Agregar tarjeta
      </button>
    </div>
    <EditorHint>
      Cada tarjeta puede dirigir a una sección de esta misma página (ej. #pregrado, #dpa) o a otra URL.
    </EditorHint>

    <CardAccordionItem
      v-for="(card, index) in localData.cards"
      :key="card.id || index"
      :edit-key="`cards.${index}`"
      :title="card.title || `Tarjeta ${index + 1}`"
      :index="index"
      :total="localData.cards.length"
      :open="openIndex === index"
      :locked="localData.cards.length <= 1"
      item-label="Tarjeta"
      remove-label="Quitar tarjeta"
      @toggle="toggleCard(index)"
      @move="moveCard(index, $event)"
      @remove="removeCard(index)"
    >
      <EditorText
        v-model="card.title"
        data-edit-target=".title"
        label="Título"
        placeholder="Ej. Terminé el colegio"
        class="mb-2"
      />

      <EditorTextarea
        v-model="card.desc"
        data-edit-target=".desc"
        label="Descripción"
        :rows="2"
        placeholder="Conoce las carreras..."
        class="mb-2"
      />

      <EditorImage
        v-model="card.image"
        v-model:alt="card.imageAlt"
        label="Imagen de la tarjeta"
        noun="imagen"
        :focus-values="card.imageFocusProfiles"
        :focus-modes="imageFocusModes"
        :focus-height="120"
        focus-crop-preview
        :focus-sliders="false"
        alt-only-with-image
        alt-label="Texto alternativo de la imagen"
        alt-placeholder="Ej. Estudiantes de pregrado ESAN"
        data-edit-target=".image"
        alt-edit-target=".imageAlt"
        class="mb-2"
        @select="$emit('select-image', { item: card, field: 'image' })"
        @update:focus-values="saveImageFocusProfiles(card, $event)"
        @remove="resetCardImageExtras(card)"
      />

      <EditorUrl
        v-model="card.href"
        v-model:target="card.target"
        :sections="selectableSections"
        data-edit-target=".href"
        label="Enlace / Destino"
        placeholder="#pregrado o /carreras"
      />
    </CardAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
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
  normalizeAudienceCard,
  normalizeAudienceSwitcherData,
  type AudienceCardItem,
  type AudienceSwitcherData,
} from './shared/types';

interface AvailableSectionOption {
  id: string;
  title?: string;
  type?: string;
  sectionId?: string;
}

const props = defineProps<{
  modelValue?: AudienceSwitcherData;
  availableSections?: AvailableSectionOption[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: Required<AudienceSwitcherData>): void;
  (e: 'select-image', payload: { item: any; field: string }): void;
}>();

const imageFocusModes = createImageFocusModes({
  web: '588 / 180',
  tablet: '16 / 9',
  mobile: '16 / 9',
});

const localData = ref<Required<AudienceSwitcherData>>(
  normalizeAudienceSwitcherData(props.modelValue),
);
const openIndex = ref<number | null>(0);

const selectableSections = computed(() =>
  (props.availableSections ?? []).filter(
    (sec) => sec && sec.type !== 'audience-switcher',
  ),
);

const toggleCard = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addCard = () => {
  localData.value.cards.push(
    normalizeAudienceCard(
      {
        id: `as-${Date.now()}`,
        title: 'Nueva opción',
        desc: 'Descripción de este perfil',
        image: '',
        href: '',
        target: '',
      },
      localData.value.cards.length,
    ),
  );
  openIndex.value = localData.value.cards.length - 1;
};

const moveCard = (index: number, delta: -1 | 1) => {
  const targetIndex = index + delta;
  if (targetIndex < 0 || targetIndex >= localData.value.cards.length) return;
  const [moved] = localData.value.cards.splice(index, 1);
  localData.value.cards.splice(targetIndex, 0, moved);
  if (openIndex.value === index) openIndex.value = targetIndex;
};

const removeCard = (index: number) => {
  if (localData.value.cards.length <= 1) return;
  localData.value.cards.splice(index, 1);
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};

const resetCardImageExtras = (card: AudienceCardItem) => {
  card.imageAlt = '';
  card.imageFocusX = 50;
  card.imageFocusY = 50;
  card.imageFocusProfiles = normalizeImageFocusProfiles(undefined, 50, 50);
};

watch(
  () => props.modelValue,
  (newVal) => {
    const normalized = normalizeAudienceSwitcherData(newVal);
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
