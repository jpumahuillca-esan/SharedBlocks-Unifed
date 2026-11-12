<template>
  <div class="smd-editor">
    <h6 class="fw-bold small text-uppercase mb-2">Textos del Banner</h6>

    <EditorText
      v-model="localData.title"
      data-edit-target="title"
      class="mb-2"
      label="Título"
      :maxlength="120"
      placeholder="Modalidades de estudios"
    />

    <EditorTextarea
      v-model="localData.subtitle"
      data-edit-target="subtitle"
      class="mb-3"
      label="Subtítulo"
      :rows="3"
      :maxlength="260"
      placeholder="Llevas tus clases desde el campus, desde casa o el lugar que escojas."
    />

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-2">
      <h6 class="fw-bold small text-uppercase m-0">Pastillas de Modalidad</h6>
      <span class="badge bg-secondary">{{ localData.badges.length }}</span>
    </div>

    <div
      v-for="(badge, index) in localData.badges"
      :key="badge.id"
      class="d-flex align-items-center gap-2 mb-2"
    >
      <div class="flex-grow-1">
        <EditorText
          v-model="badge.label"
          :data-edit-target="`badges.${index}.label`"
          :maxlength="60"
          placeholder="PRESENCIAL"
        />
      </div>
      <button
        type="button"
        class="btn btn-sm btn-outline-danger flex-shrink-0"
        title="Quitar modalidad"
        @click="removeBadge(index)"
      >
        <i class="las la-trash"></i>
      </button>
    </div>

    <button
      type="button"
      class="btn btn-sm btn-danger w-100 mt-1 mb-3"
      @click="addBadge"
    >
      <i class="las la-plus me-1"></i> Agregar modalidad
    </button>

    <hr />

    <h6 class="fw-bold small text-uppercase mb-2">Imagen Lateral y Fondo</h6>

    <EditorBrandColor
      v-model="localData.panelColorToken"
      data-edit-target="panelColorToken"
      class="mb-3"
    />

    <EditorImage
      v-model="localData.image"
      v-model:alt="localData.imageAlt"
      data-edit-target="image"
      alt-edit-target="imageAlt"
      class="mb-3"
      label="Imagen recortada (persona a la derecha)"
      hint="Si se deja vacío, utiliza la imagen oficial recortada del diseño Figma."
      @select="$emit('select-image', { item: localData, field: 'image' })"
    />

    <EditorImage
      v-model="localData.backgroundImage"
      class="mb-2"
      label="Textura / Imagen de fondo del panel (opcional)"
      @select="$emit('select-image', { item: localData, field: 'backgroundImage' })"
    />

    <div v-if="localData.backgroundImage" class="mb-2">
      <label class="form-label small fw-bold">
        Opacidad de textura ({{ localData.backgroundOverlayOpacity }}%)
      </label>
      <input
        v-model.number="localData.backgroundOverlayOpacity"
        type="range"
        min="5"
        max="60"
        step="5"
        class="form-range"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorBrandColor from '../../../editor-beta/EditorBrandColor/EditorBrandColor.vue';
import {
  normalizeStudyModalitiesData,
  createEmptyStudyModalityBadge,
} from './types';

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'select-image', payload: { item: any; field: string }): void;
}>();

const localData = reactive(normalizeStudyModalitiesData(props.modelValue));

watch(
  localData,
  (val) => {
    emit('update:modelValue', JSON.parse(JSON.stringify(val)));
  },
  { deep: true },
);

const addBadge = () => {
  localData.badges.push(createEmptyStudyModalityBadge());
};

const removeBadge = (index: number) => {
  localData.badges.splice(index, 1);
};
</script>

