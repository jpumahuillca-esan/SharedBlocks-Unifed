<template>
  <div class="about-dpa-editor">
    <h6 class="fw-bold small text-uppercase mb-2">Contenido Principal</h6>

    <EditorText
      v-model="localData.eyebrow"
      data-edit-target="eyebrow"
      class="mb-2"
      label="Antetítulo (opcional)"
      :maxlength="80"
      placeholder="ESAN DPA"
    />

    <EditorText
      v-model="localData.title"
      data-edit-target="title"
      class="mb-2"
      label="Título"
      :maxlength="140"
      placeholder="¿Qué es ESAN DPA?"
    />

    <EditorTextarea
      v-model="localData.description"
      data-edit-target="description"
      class="mb-3"
      label="Descripción"
      :rows="5"
      :maxlength="600"
      placeholder="Desde 2013, ESAN DPA forma a adultos con experiencia laboral..."
    />

    <div class="mb-3" data-edit-target="backgroundColor">
      <label class="form-label small fw-bold">Fondo de la sección</label>
      <select v-model="localData.backgroundColor" class="form-select form-select-sm">
        <option value="#FFFFFF">Blanco (#FFFFFF — Figma)</option>
        <option value="#F1F5F9">Gris suave (#F1F5F9)</option>
        <option value="transparent">Transparente</option>
      </select>
    </div>

    <hr />

    <h6 class="fw-bold small text-uppercase mb-2">Botones de Acción</h6>

    <div class="p-2 mb-2 rounded border bg-white">
      <small class="fw-bold text-muted d-block mb-1">Botón Primario (Rojo)</small>
      <EditorText
        v-model="localData.primaryButton.label"
        data-edit-target="primaryButton.label"
        class="mb-2"
        label="Texto del botón"
        :maxlength="80"
        placeholder="Ver modalidades de ingreso"
      />
      <EditorUrl
        v-model="localData.primaryButton.url"
        v-model:target="localData.primaryButton.target"
        label="URL de destino"
      />
    </div>

    <div class="p-2 mb-3 rounded border bg-white">
      <small class="fw-bold text-muted d-block mb-1">Enlace Secundario (Flecha)</small>
      <EditorText
        v-model="localData.secondaryButton.label"
        data-edit-target="secondaryButton.label"
        class="mb-2"
        label="Texto del enlace"
        :maxlength="80"
        placeholder="Ver proceso de inscripción"
      />
      <EditorUrl
        v-model="localData.secondaryButton.url"
        v-model:target="localData.secondaryButton.target"
        label="URL de destino"
      />
    </div>

    <hr />

    <h6 class="fw-bold small text-uppercase mb-2">Video Destacado</h6>

    <EditorImage
      v-model="localData.image"
      v-model:alt="localData.imageAlt"
      :focus-values="localData.imageFocusProfiles"
      :focus-modes="imageFocusModes"
      focus-ratio="16 / 9"
      focus-crop-preview
      data-edit-target="image"
      alt-edit-target="imageAlt"
      class="mb-2"
      label="Miniatura del video"
      hint="Imagen de portada antes de reproducir el video."
      @select="$emit('select-image', { item: localData, field: 'image' })"
      @update:focus-values="saveFocusProfiles($event)"
    />

    <EditorUrl
      v-model="localData.videoUrl"
      data-edit-target="videoUrl"
      class="mb-2"
      label="URL del Video (YouTube, Vimeo o MP4)"
      placeholder="https://www.youtube.com/watch?v=..."
    />

    <EditorText
      v-model="localData.duration"
      data-edit-target="duration"
      class="mb-2"
      label="Duración"
      hint="Se muestra en la esquina inferior derecha del video (ej. 02:14)."
      placeholder="02:14"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import { type ImageFocusProfiles } from '../../../../helpers/imageFocus';
import { normalizeAboutDpaData } from './types';

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'select-image', payload: { item: any; field: string }): void;
}>();

const localData = reactive(normalizeAboutDpaData(props.modelValue));

const imageFocusModes = [
  { key: 'web', label: 'Web', ratio: '16 / 9' },
  { key: 'tablet', label: 'Tablet', ratio: '16 / 9' },
  { key: 'mobile', label: 'Móvil', ratio: '16 / 9' },
];

watch(
  localData,
  (val) => {
    emit('update:modelValue', JSON.parse(JSON.stringify(val)));
  },
  { deep: true },
);

const saveFocusProfiles = (profiles: ImageFocusProfiles) => {
  localData.imageFocusProfiles = profiles;
  localData.imageFocusX = profiles.web.x;
  localData.imageFocusY = profiles.web.y;
};
</script>

