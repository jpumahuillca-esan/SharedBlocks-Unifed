<template>
  <div class="editor-image-focus">
    <div
      ref="preview"
      class="editor-image-focus__preview"
      :style="previewStyle"
      :aria-hidden="sliders ? 'true' : undefined"
      @pointerdown="startFocusDrag"
      @pointermove="moveFocus"
      @pointerup="endFocusDrag"
      @pointercancel="endFocusDrag"
    >
      <img
        :src="image"
        alt=""
        draggable="false"
        :style="{
          objectPosition: `${normalizedX}% ${normalizedY}%`,
        }"
      />

      <span
        class="editor-image-focus__point"
        :style="{
          left: `${normalizedX}%`,
          top: `${normalizedY}%`,
        }"
      ></span>
    </div>

    <p class="editor-image-focus__hint">
      Haz clic o arrastra el punto para ajustar el encuadre.
    </p>

    <template v-if="sliders">
      <div class="editor-image-focus__control">
        <div class="editor-image-focus__label">
          Horizontal <span>{{ Math.round(normalizedX) }}%</span>
        </div>
        <input
          type="range"
          class="form-range"
          min="0"
          max="100"
          step="1"
          :value="normalizedX"
          data-edit-target=".imageFocusX"
          aria-label="Punto focal horizontal"
          @input="updateFocusX"
        />
      </div>

      <div class="editor-image-focus__control">
        <div class="editor-image-focus__label">
          Vertical <span>{{ Math.round(normalizedY) }}%</span>
        </div>
        <input
          type="range"
          class="form-range"
          min="0"
          max="100"
          step="1"
          :value="normalizedY"
          data-edit-target=".imageFocusY"
          aria-label="Punto focal vertical"
          @input="updateFocusY"
        />
      </div>
    </template>

    <!-- Sin deslizadores, el valor exacto queda a la vista de todos modos. -->
    <div v-else class="editor-image-focus__label">
      <span>X: {{ Math.round(normalizedX) }}%</span>
      <span>Y: {{ Math.round(normalizedY) }}%</span>
    </div>

    <button
      type="button"
      class="btn btn-sm btn-link editor-image-focus__reset"
      @click="resetFocus"
    >
      Centrar punto focal
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * Enfocador de imagen: elegir qué parte de la foto debe quedar a la vista
 * cuando el bloque la recorta (`object-position: X% Y%`).
 *
 * La vista previa aplica ese mismo `object-position`, así que se ve el recorte
 * real mientras se mueve el punto. Se puede hacer clic, arrastrar, o afinar con
 * los deslizadores, que además son la vía por teclado.
 *
 * Nació en ecosystem-esan y sub-hero tenía una copia propia del arrastre; esta
 * es la única.
 */
import { computed, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    image: string;
    focusX?: number;
    focusY?: number;
    /** Alto de la vista previa, en px. Lo anula `ratio`. */
    height?: number;
    /**
     * Proporción de la vista previa (`16 / 9`, `3 / 4`): la de la caja en la que
     * el bloque recorta la foto, para ver el recorte real mientras se mueve el punto.
     */
    ratio?: string;
    /**
     * Con `ratio`, el alto máximo en px: una proporción vertical se estrecha en
     * vez de alargar el panel.
     */
    maxHeight?: number;
    /**
     * Con deslizadores (por defecto) o solo con arrastre y lectura de X e Y.
     * Sin deslizadores no hay forma de moverlo con teclado: úsese solo si se
     * quiere un panel más corto.
     */
    sliders?: boolean;
  }>(),
  {
    focusX: 50,
    focusY: 50,
    height: 110,
    maxHeight: 240,
    sliders: true,
  },
);

const emit = defineEmits<{
  (event: 'update:focusX', value: number): void;
  (event: 'update:focusY', value: number): void;
}>();

const preview = ref<HTMLElement | null>(null);
const isDragging = ref(false);

const normalizeFocus = (value: number): number =>
  Number.isFinite(Number(value))
    ? Math.min(100, Math.max(0, Number(value)))
    : 50;

/*
 * Con proporción: la caja la manda `aspect-ratio`, y si el alto saldría mayor que
 * `maxHeight` se acota el ANCHO (limitar solo el alto deformaría la proporción) y
 * se centra. Sin proporción, alto fijo.
 */
const previewStyle = computed(() => {
  if (!props.ratio) return { height: `${props.height}px` };

  const [w, h] = props.ratio.split('/').map((part) => Number(part.trim()));
  const value = w > 0 && h > 0 ? w / h : 0;

  return {
    aspectRatio: props.ratio,
    width: value ? `min(100%, ${Math.round(props.maxHeight * value)}px)` : '100%',
    margin: '0 auto',
  };
});

const normalizedX = computed(() => normalizeFocus(props.focusX));
const normalizedY = computed(() => normalizeFocus(props.focusY));

const updateFromPointer = (event: PointerEvent) => {
  const element = preview.value;
  if (!element) return;

  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  emit(
    'update:focusX',
    normalizeFocus(((event.clientX - rect.left) / rect.width) * 100),
  );
  emit(
    'update:focusY',
    normalizeFocus(((event.clientY - rect.top) / rect.height) * 100),
  );
};

const startFocusDrag = (event: PointerEvent) => {
  isDragging.value = true;
  preview.value?.setPointerCapture?.(event.pointerId);
  updateFromPointer(event);
};

const moveFocus = (event: PointerEvent) => {
  if (isDragging.value) updateFromPointer(event);
};

const endFocusDrag = (event: PointerEvent) => {
  isDragging.value = false;

  if (preview.value?.hasPointerCapture?.(event.pointerId)) {
    preview.value.releasePointerCapture(event.pointerId);
  }
};

const updateFocusX = (event: Event) => {
  emit(
    'update:focusX',
    normalizeFocus((event.target as HTMLInputElement).valueAsNumber),
  );
};

const updateFocusY = (event: Event) => {
  emit(
    'update:focusY',
    normalizeFocus((event.target as HTMLInputElement).valueAsNumber),
  );
};

const resetFocus = () => {
  emit('update:focusX', 50);
  emit('update:focusY', 50);
};
</script>

<style scoped>
.editor-image-focus__preview {
  position: relative;
  overflow: hidden;
  border: 1px dashed #c6cedb;
  border-radius: 7px;
  background: #f4f6fa;
  cursor: crosshair;
  touch-action: none;
  user-select: none;
}

.editor-image-focus__preview img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
}

.editor-image-focus__point {
  position: absolute;
  width: 24px;
  height: 24px;
  transform: translate(-50%, -50%);
  border: 3px solid #fff;
  border-radius: 50%;
  background: rgba(31, 39, 51, 0.55);
  box-shadow: 0 0 0 2px rgba(31, 39, 51, 0.35);
  pointer-events: none;
}

.editor-image-focus__point::before,
.editor-image-focus__point::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  background: #fff;
  transform: translate(-50%, -50%);
}

.editor-image-focus__point::before {
  width: 8px;
  height: 2px;
}

.editor-image-focus__point::after {
  width: 2px;
  height: 8px;
}

.editor-image-focus__hint {
  margin: 5px 0 8px;
  color: #6b7688;
  font-size: 11px;
  line-height: 1.4;
}

.editor-image-focus__control {
  margin-bottom: 4px;
}

.editor-image-focus__label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0;
  color: #6b7688;
  font-size: 11px;
}

.editor-image-focus__control .form-range {
  margin-bottom: 0;
}

.editor-image-focus__reset {
  padding: 0;
  font-size: 11px;
  text-decoration: none;
}
</style>
