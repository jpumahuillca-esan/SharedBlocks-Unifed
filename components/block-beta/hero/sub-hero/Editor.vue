<template>
  <div class="sh-editor">
    <!-- ANTETÍTULO -->
    <label class="form-label">Antetítulo</label>
    <input
      v-model="localData.eyebrow"
      type="text"
      class="form-control form-control-sm mb-1"
      placeholder="ESAN UNIVERSITY"
      :maxlength="rules.eyebrow.maxLength"
    />
    <div class="sh-field-meta mb-2">
      <span>Máximo {{ rules.eyebrow.maxLength }} caracteres</span>
      <span>{{ localData.eyebrow.length }}/{{ rules.eyebrow.maxLength }}</span>
    </div>

    <!-- H1 -->
    <div class="form-check form-switch mb-3">
      <input
        id="subhero-eyebrow-h1"
        v-model="localData.eyebrowAsH1"
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
    <label class="form-label">Título</label>
    <textarea
      v-model="localData.title"
      class="form-control form-control-sm mb-1"
      rows="2"
      placeholder="Explora nuestras 17 carreras universitarias"
      :maxlength="rules.title.maxLength"
    ></textarea>
    <div class="sh-field-meta mb-3">
      <span>Máximo {{ rules.title.maxLength }} caracteres</span>
      <span>{{ localData.title.length }}/{{ rules.title.maxLength }}</span>
    </div>

    <!-- DESCRIPCIÓN -->
    <label class="form-label">Descripción</label>
    <textarea
      v-model="localData.desc"
      class="form-control form-control-sm mb-1"
      rows="2"
      placeholder="Ingresa una descripción complementaria"
      :maxlength="rules.desc.maxLength"
    ></textarea>
    <div class="sh-field-meta mb-3">
      <span>Máximo {{ rules.desc.maxLength }} caracteres</span>
      <span>{{ localData.desc.length }}/{{ rules.desc.maxLength }}</span>
    </div>

    <!-- COLOR -->
    <label class="form-label">Color del panel</label>
    <div class="sh-color-selector mb-3">
      <button
        type="button"
        class="sh-color-current"
        :aria-expanded="colorsOpen"
        aria-controls="subhero-color-options"
        @click="colorsOpen = !colorsOpen"
      >
        <span
          class="sh-color-swatch"
          :style="{ backgroundColor: `var(${selectedColor.token})` }"
          aria-hidden="true"
        ></span>
        <span class="sh-color-current__label">{{ selectedColor.label }}</span>
        <span class="sh-color-current__action">
          Cambiar
          <i class="las" :class="colorsOpen ? 'la-angle-up' : 'la-angle-down'"></i>
        </span>
      </button>

      <div v-if="colorsOpen" id="subhero-color-options" class="sh-color-options">
        <button
          v-for="option in otherColorOptions"
          :key="option.token"
          type="button"
          class="sh-color-option"
          @click="selectColor(option.token)"
        >
          <span
            class="sh-color-swatch"
            :style="{ backgroundColor: `var(${option.token})` }"
            aria-hidden="true"
          ></span>
          <span class="sh-color-option__label">{{ option.label }}</span>
        </button>
      </div>
    </div>

    <!-- IMAGEN -->
    <label class="form-label">Imagen</label>
    <div class="sh-image-preview mb-2">
      <img
        v-if="localData.image"
        :src="localData.image"
        :alt="localData.imageAlt"
        :style="{
          objectPosition: `${localData.imageFocusX}% ${localData.imageFocusY}%`
        }"
      />
      <span v-else class="text-muted small">Sin imagen</span>
    </div>

    <div class="d-flex gap-2 mb-3">
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary flex-grow-1"
        @click="selectImage"
      >
        <i class="las la-image me-1"></i>
        {{ localData.image ? 'Cambiar imagen' : 'Subir imagen' }}
      </button>

      <button
        v-if="localData.image"
        type="button"
        class="btn btn-sm btn-outline-danger"
        title="Quitar imagen"
        @click="removeImage"
      >
        <i class="las la-trash"></i>
      </button>
    </div>

    <template v-if="localData.image">
      <!-- ALT -->
      <label class="form-label">Texto alternativo de la imagen</label>
      <input
        v-model="localData.imageAlt"
        type="text"
        class="form-control form-control-sm mb-1"
        :maxlength="IMAGE_ALT_MAX_LENGTH"
        placeholder="Ej. Estudiantes de ESAN en el campus"
      />

      <div class="sh-field-meta mb-1">
        <span>Máximo {{ IMAGE_ALT_MAX_LENGTH }} caracteres</span>
        <span>{{ localData.imageAlt.length }}/{{ IMAGE_ALT_MAX_LENGTH }}</span>
      </div>

      <p class="sh-hint mb-3">
        Describe la imagen si aporta información. Déjalo vacío si es decorativa.
      </p>

      <!-- PUNTO FOCAL -->
      <div class="sh-focus-header mb-2">
        <label class="form-label mb-0">Punto de enfoque</label>
        <button
          type="button"
          class="btn btn-sm btn-link sh-focus-reset"
          @click="resetFocus"
        >
          Centrar
        </button>
      </div>

      <p class="sh-hint mb-2">
        Haz clic o arrastra el punto hacia la zona que debe mantenerse visible.
      </p>

      <div
        ref="focusArea"
        class="sh-focus-editor"
        @pointerdown="startFocusDrag"
        @pointermove="moveFocus"
        @pointerup="endFocusDrag"
        @pointercancel="endFocusDrag"
      >
        <img
          :src="localData.image"
          alt=""
          draggable="false"
        />

        <span
          class="sh-focus-point"
          :style="{
            left: `${localData.imageFocusX}%`,
            top: `${localData.imageFocusY}%`
          }"
          aria-hidden="true"
        ></span>
      </div>

      <div class="sh-field-meta mt-1 mb-3">
        <span>X: {{ Math.round(localData.imageFocusX) }}%</span>
        <span>Y: {{ Math.round(localData.imageFocusY) }}%</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  SUBHERO_COLOR_OPTIONS,
  resolvePanelColorToken
} from './shared/config';
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
const colorOptions = SUBHERO_COLOR_OPTIONS;
const IMAGE_ALT_MAX_LENGTH = 150;

const colorsOpen = ref(false);
const focusArea = ref<HTMLElement | null>(null);
const draggingFocus = ref(false);

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

const selectedColor = computed(() =>
  colorOptions.find(
    (option) =>
      option.token === localData.value.panelColorToken
  ) ?? colorOptions[0]
);

const otherColorOptions = computed(() =>
  colorOptions.filter(
    (option) =>
      option.token !== localData.value.panelColorToken
  )
);

const selectColor = (token: string) => {
  localData.value.panelColorToken = token;
  colorsOpen.value = false;
};

const selectImage = () => {
  emit('select-image', {
    item: localData.value,
    field: 'image'
  });
};

const removeImage = () => {
  localData.value.image = '';
  localData.value.imageAlt = '';
  localData.value.imageFocusX = 50;
  localData.value.imageFocusY = 50;
};

const resetFocus = () => {
  localData.value.imageFocusX = 50;
  localData.value.imageFocusY = 50;
};

const updateFocus = (event: PointerEvent) => {
  const element = focusArea.value;
  if (!element) return;

  const rect = element.getBoundingClientRect();

  if (!rect.width || !rect.height) return;

  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  localData.value.imageFocusX = Math.min(100, Math.max(0, x));
  localData.value.imageFocusY = Math.min(100, Math.max(0, y));
};

const startFocusDrag = (event: PointerEvent) => {
  draggingFocus.value = true;

  const element = event.currentTarget as HTMLElement;

  if (element.setPointerCapture) {
    element.setPointerCapture(event.pointerId);
  }

  updateFocus(event);
};

const moveFocus = (event: PointerEvent) => {
  if (!draggingFocus.value) return;
  updateFocus(event);
};

const endFocusDrag = (event: PointerEvent) => {
  draggingFocus.value = false;

  const element = event.currentTarget as HTMLElement;

  if (
    element.hasPointerCapture &&
    element.hasPointerCapture(event.pointerId)
  ) {
    element.releasePointerCapture(event.pointerId);
  }
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

.sh-field-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--bs-secondary-color);
}

.sh-switch-label {
  font-size: 12.5px;
  font-weight: 500;
}

/* COLOR */
.sh-color-selector {
  position: relative;
}

.sh-color-current,
.sh-color-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
  border: 1px solid var(--bs-border-color);
  border-radius: var(--bs-border-radius);
  background: var(--bs-body-bg);
  color: var(--bs-body-color);
  text-align: left;
  cursor: pointer;
}

.sh-color-current {
  padding: 8px 10px;
}

.sh-color-current:hover,
.sh-color-option:hover {
  background: var(--bs-tertiary-bg);
}

.sh-color-swatch {
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  border: 1px solid var(--bs-border-color);
  border-radius: var(--bs-border-radius-sm);
}

.sh-color-current__label,
.sh-color-option__label {
  min-width: 0;
  flex: 1;
  font-size: 12.5px;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sh-color-current__action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  font-size: 11.5px;
  font-weight: 500;
  color: var(--bs-secondary-color);
}

.sh-color-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  margin-top: 6px;
  padding: 6px;
  border: 1px solid var(--bs-border-color);
  border-radius: var(--bs-border-radius);
  background: var(--bs-tertiary-bg);
}

.sh-color-option {
  padding: 7px 8px;
}

/* IMAGE */
.sh-image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 130px;
  border: 1px dashed var(--bs-border-color);
  border-radius: var(--bs-border-radius);
  background: var(--bs-tertiary-bg);
  overflow: hidden;
}

.sh-image-preview img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* FOCUS */
.sh-focus-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.sh-focus-reset {
  padding: 0;
  border: 0;
  font-size: 11.5px;
  text-decoration: none;
}

.sh-focus-editor {
  position: relative;
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--bs-border-color);
  border-radius: var(--bs-border-radius);
  background: var(--bs-tertiary-bg);
  cursor: crosshair;
  touch-action: none;
  user-select: none;
}

.sh-focus-editor img {
  display: block;
  width: 100%;
  height: auto;
  pointer-events: none;
  user-select: none;
}

.sh-focus-point {
  position: absolute;
  width: 24px;
  height: 24px;
  transform: translate(-50%, -50%);
  border: 3px solid var(--bs-body-bg);
  border-radius: 50%;
  background: color-mix(
    in srgb,
    var(--bs-body-color) 65%,
    transparent
  );
  box-shadow: 0 0 0 2px color-mix(
    in srgb,
    var(--bs-body-color) 35%,
    transparent
  );
  pointer-events: none;
}

.sh-focus-point::before,
.sh-focus-point::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  background: var(--bs-body-bg);
  transform: translate(-50%, -50%);
}

.sh-focus-point::before {
  width: 8px;
  height: 2px;
}

.sh-focus-point::after {
  width: 2px;
  height: 8px;
}

@media (max-width: 340px) {
  .sh-color-options {
    grid-template-columns: 1fr;
  }
}
</style>