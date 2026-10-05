<template>
  <div class="sh-editor">
    <!-- ANTETÍTULO -->
    <EditorText
      v-model="localData.eyebrow"
      data-edit-target="eyebrow"
      class="mb-2"
      label="Antetítulo"
      placeholder="ESAN UNIVERSITY"
      :maxlength="rules.eyebrow.maxLength"
    />

    <!-- H1 -->
    <div class="form-check form-switch mb-3">
      <input
        id="subhero-eyebrow-h1"
        v-model="localData.eyebrowAsH1"
        data-edit-target="eyebrowAsH1"
        class="form-check-input"
        type="checkbox"
        :disabled="!localData.eyebrow.trim()"
      />
      <label class="form-check-label sh-switch-label" for="subhero-eyebrow-h1">
        Usar antetítulo como H1
      </label>
      <p class="sh-hint mt-1">
        Si se activa, el título mantiene su diseño pero deja de ser H1.
      </p>
    </div>

    <!-- TÍTULO -->
    <EditorTextarea
      v-model="localData.title"
      data-edit-target="title"
      class="mb-3"
      label="Título"
      :rows="2"
      placeholder="Explora nuestras 17 carreras universitarias"
      :maxlength="rules.title.maxLength"
    />

    <!-- DESCRIPCIÓN -->
    <EditorTextarea
      v-model="localData.desc"
      data-edit-target="desc"
      class="mb-3"
      label="Descripción"
      :rows="2"
      placeholder="Ingresa una descripción complementaria"
      :maxlength="rules.desc.maxLength"
    />

    <!-- COLOR -->
    <EditorBrandColor
      v-model="localData.panelColorToken"
      data-edit-target="panelColorToken"
      class="mb-3"
    />

    <!-- IMAGEN -->
    <!--
      Con imagen, la vista previa es el enfocador: se ve el recorte real mientras
      se mueve el punto. El alt solo se pide cuando ya hay imagen que describir.
    -->
    <EditorImage
      v-model="localData.image"
      v-model:alt="localData.imageAlt"
      v-model:focus-x="localData.imageFocusX"
      v-model:focus-y="localData.imageFocusY"
      data-edit-target="image"
      alt-edit-target="imageAlt"
      :focus-height="130"
      :focus-sliders="false"
      alt-only-with-image
      alt-label="Texto alternativo de la imagen"
      alt-placeholder="Ej. Estudiantes de ESAN en el campus"
      :alt-maxlength="IMAGE_ALT_MAX_LENGTH"
      alt-hint="Describe la imagen si aporta información. Déjalo vacío si es decorativa."
      @select="selectImage"
      @remove="resetImageExtras"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import EditorBrandColor from '../../../editor-beta/EditorBrandColor/EditorBrandColor.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import { resolvePanelColorToken } from './shared/config';
import { SUBHERO_CONTENT_RULES } from './shared/rule';

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: any): void;
  (
    event: 'select-image',
    payload: {
      item: any;
      field: string;
    }
  ): void;
}>();

const rules = SUBHERO_CONTENT_RULES;
const IMAGE_ALT_MAX_LENGTH = 150;

const normalizeFocus = (value: unknown): number => {
  const number = Number(value);
  if (!Number.isFinite(number)) return 50;
  return Math.min(100, Math.max(0, number));
};

const build = (source: any) => {
  const eyebrow = source?.eyebrow ?? '';

  return {
    eyebrow,
    eyebrowAsH1:
      eyebrow.trim().length > 0 &&
      source?.eyebrowAsH1 === true,
    title: source?.title ?? '',
    desc: source?.desc ?? '',
    panelColorToken: resolvePanelColorToken(source),
    image: source?.image ?? '',
    imageAlt: source?.imageAlt ?? '',
    imageFocusX: normalizeFocus(source?.imageFocusX),
    imageFocusY: normalizeFocus(source?.imageFocusY)
  };
};

const localData = ref(build(props.modelValue));

const selectImage = () => {
  emit('select-image', {
    item: localData.value,
    field: 'image'
  });
};

/*
 * Al quitar la imagen, EditorImage ya vacía `image`; aquí se limpia lo que
 * dependía de ella: el texto alternativo y el punto focal.
 */
const resetImageExtras = () => {
  localData.value.imageAlt = '';
  localData.value.imageFocusX = 50;
  localData.value.imageFocusY = 50;
};

/* Si se borra el antetítulo no puede mantenerse activo como H1. */
watch(
  () => localData.value.eyebrow,
  (eyebrow) => {
    if (!eyebrow.trim()) {
      localData.value.eyebrowAsH1 = false;
    }
  }
);

/* Bloque → Editor */
watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) return;

    const normalized = build(newValue);

    if (
      JSON.stringify(normalized) ===
      JSON.stringify(localData.value)
    ) {
      return;
    }

    localData.value = normalized;
  },
  {
    deep: true
  }
);

/* Editor → Bloque */
watch(
  localData,
  (newValue) => {
    emit(
      'update:modelValue',
      JSON.parse(JSON.stringify(newValue))
    );
  },
  {
    deep: true
  }
);
</script>

<style scoped>
.sh-hint {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--bs-secondary-color);
}

.sh-switch-label {
  font-size: 12.5px;
  font-weight: 500;
}
</style>
