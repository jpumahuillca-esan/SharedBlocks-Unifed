<template>
  <div class="editor-image" :class="$attrs.class" :style="$attrs.style as any">
    <label v-if="label" class="form-label">{{ label }}</label>

    <EditorHint v-if="hint && hintPosition === 'top'">{{ hint }}</EditorHint>

    <!-- Con punto focal, la vista previa es el propio enfocador. -->
    <EditorImageFocus
      v-if="hasFocus && model"
      class="editor-image__block"
      :image="model"
      :focus-x="focusX"
      :focus-y="focusY"
      :height="focusHeight"
      :ratio="focusRatio"
      :sliders="focusSliders"
      @update:focus-x="$emit('update:focusX', $event)"
      @update:focus-y="$emit('update:focusY', $event)"
    />

    <div
      v-else
      class="editor-image__preview editor-image__block"
      :class="{ 'is-contain': fit === 'contain' }"
      :style="previewStyle"
    >
      <img v-if="model" :src="model" alt="" />

      <!-- Estado vacío grande: toda el área es el botón de elegir. -->
      <button
        v-else-if="variant === 'dropzone'"
        v-bind="controlAttrsOf($attrs)"
        type="button"
        class="editor-image__dropzone"
        @click="$emit('select')"
      >
        <span class="editor-image__dropzone-icon">
          <i class="las la-image"></i>
        </span>
        <strong>{{ dropzoneTitle }}</strong>
        <span>{{ dropzoneText }}</span>
      </button>

      <span v-else class="text-muted small">{{ emptyText }}</span>
    </div>

    <EditorHint v-if="hint && hintPosition === 'bottom'" class="editor-image__block">{{ hint }}</EditorHint>

    <div v-if="model || variant !== 'dropzone'" class="editor-image__actions editor-image__block">
      <button
        v-bind="controlAttrsOf($attrs)"
        type="button"
        class="btn btn-sm btn-outline-secondary flex-grow-1"
        @click="$emit('select')"
      >
        <i class="las la-image me-1"></i>
        {{ model ? `Cambiar ${noun}` : selectLabel || `Subir ${noun}` }}
      </button>

      <button
        v-if="model"
        type="button"
        class="btn btn-sm btn-outline-danger"
        :title="`Quitar ${noun}`"
        @click="remove"
      >
        <i class="las la-trash"></i>
      </button>
    </div>

    <EditorText
      v-if="alt !== undefined && (!altOnlyWithImage || model)"
      class="mb-0"
      :model-value="alt"
      :label="altLabel"
      :placeholder="altPlaceholder"
      :maxlength="altMaxlength"
      :hint="altHint"
      :hint-position="altHintPosition"
      :data-edit-target="altEditTarget"
      @update:model-value="$emit('update:alt', $event)"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * Campo de imagen del panel: vista previa, "Subir/Cambiar", papelera y,
 * opcionalmente, el texto alternativo y el punto focal.
 *
 * Es el bloque que cada editor copiaba (13 veces) con su propia hoja de vista
 * previa. La URL va por `v-model`; el texto alternativo y el punto focal por
 * `v-model:alt`, `v-model:focus-x` y `v-model:focus-y`, y solo se dibujan si el
 * editor los enlaza.
 *
 * ELEGIR la imagen no lo hace este campo: emite `select` y el editor sigue
 * armando `$emit('select-image', { item, field })`, que es lo que entiende el
 * constructor (muta `item[field]` y el `v-model` se entera por la reactividad).
 * Quitarla emite `update:modelValue('')` y además `remove`, por si el editor
 * debe limpiar algo más (el alt, el punto focal).
 *
 * `data-edit-target` va al botón de elegir (o al área vacía, en `dropzone`),
 * que es lo que enfoca el panel cuando se pulsa la foto en el lienzo. La ruta
 * del alt se pasa aparte, en `alt-edit-target`.
 */
import { computed } from 'vue';
import EditorHint from '../EditorHint/EditorHint.vue';
import EditorImageFocus from '../EditorImageFocus/EditorImageFocus.vue';
import EditorText from '../EditorText/EditorText.vue';
import { controlAttrsOf } from '../_shared/fieldUtils';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    label?: string;
    hint?: string;
    /** `top`: bajo la etiqueta. `bottom`: bajo la vista previa, sobre los botones. */
    hintPosition?: 'top' | 'bottom';
    /** Cómo se llama en los botones: "Subir imagen", "Subir foto"… */
    noun?: string;
    /** Texto del botón cuando aún no hay imagen, si no es "Subir <noun>". */
    selectLabel?: string;
    /** Alto de la vista previa, en px. Lo anula `ratio`. */
    height?: number;
    /** Proporción de la vista previa (`16 / 10`): para ver el encuadre real. */
    ratio?: string;
    /** `contain` para logos: recortados dejan de leerse. */
    fit?: 'cover' | 'contain';
    /** `dropzone`: el estado vacío es un área grande que abre el selector. */
    variant?: 'plain' | 'dropzone';
    emptyText?: string;
    dropzoneTitle?: string;
    dropzoneText?: string;

    /** Texto alternativo. Sin él (undefined) el campo no se dibuja. */
    alt?: string;
    altLabel?: string;
    altPlaceholder?: string;
    altMaxlength?: number;
    altHint?: string;
    /** Dónde va la ayuda del alt: bajo la etiqueta o tras el campo. */
    altHintPosition?: 'top' | 'bottom';
    altEditTarget?: string;
    /** El alt solo aparece cuando ya hay imagen. */
    altOnlyWithImage?: boolean;

    /** Punto focal. Sin ellos (undefined) no se dibuja el enfocador. */
    focusX?: number;
    focusY?: number;
    focusHeight?: number;
    /**
     * Proporción de la caja donde el bloque recorta la foto (`16 / 9`). La vista
     * previa del enfocador la usa; sin ella, `focusHeight`.
     */
    focusRatio?: string;
    focusSliders?: boolean;
  }>(),
  {
    label: 'Imagen',
    hintPosition: 'top',
    noun: 'imagen',
    height: 90,
    fit: 'cover',
    variant: 'plain',
    emptyText: 'Sin imagen',
    dropzoneTitle: 'Selecciona una imagen',
    dropzoneText: 'Haz clic para elegir una imagen.',
    altLabel: 'Texto alternativo',
    altHintPosition: 'bottom',
    focusHeight: 110,
    focusSliders: true,
  },
);

const emit = defineEmits<{
  (event: 'select'): void;
  (event: 'remove'): void;
  (event: 'update:alt', value: string): void;
  (event: 'update:focusX', value: number): void;
  (event: 'update:focusY', value: number): void;
}>();

const model = defineModel<string>({ default: '' });

const hasFocus = computed(() => props.focusX !== undefined && props.focusY !== undefined);

const previewStyle = computed(() =>
  props.ratio ? { aspectRatio: props.ratio } : { height: `${props.height}px` },
);

const remove = () => {
  model.value = '';
  // El punto focal es de ESTA foto: sin foto, vuelve al centro.
  if (hasFocus.value) {
    emit('update:focusX', 50);
    emit('update:focusY', 50);
  }
  emit('remove');
};
</script>

<style scoped>
.editor-image__block {
  margin-bottom: 8px;
}

/* El espacio de abajo es de quien lo usa (`class="mb-2"`), no de la última pieza. */
.editor-image > :last-child {
  margin-bottom: 0;
}

.editor-image__preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow: hidden;
  border: 1px dashed #c6cedb;
  border-radius: 7px;
  background: #f4f6fa;
}

.editor-image__preview img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* `contain` y no `cover`: una foto aguanta el recorte, pero un logo recortado
   deja de leerse. */
.editor-image__preview.is-contain {
  padding: 8px;
  background: #fff;
}

.editor-image__preview.is-contain img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.editor-image__actions {
  display: flex;
  gap: 8px;
}

/* Estado vacío grande: el área entera es el botón. */
.editor-image__dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 100%;
  padding: 12px;
  border: 0;
  background: transparent;
  color: #6b7688;
  text-align: center;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.editor-image__dropzone:hover {
  background: #edf1f6;
}

.editor-image__dropzone-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin-bottom: 2px;
  border-radius: 7px;
  background: #e3e8ef;
  font-size: 19px;
}

.editor-image__dropzone strong {
  color: #3e4755;
  font-size: 12px;
  font-weight: 700;
}

.editor-image__dropzone > span:last-child {
  max-width: 220px;
  font-size: 10.5px;
  line-height: 1.35;
}
</style>
