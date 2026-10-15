<template>
  <div class="editor-image-focus">
    <!--
      Recuadro de la vista previa. Con `crop-preview` la foto se ve ENTERA y toma
      su propia proporción, así que una foto vertical o casi cuadrada quedaba en
      una tira estrecha con huecos a los lados. El fondo es la misma foto
      desenfocada: llena todo el recuadro sin estirar ni recortar la foto de
      verdad, que se muestra nítida y a su tamaño encima. Es solo decoración
      (aria-hidden, sin eventos) y reutiliza la misma URL: no descarga nada más.
    -->
    <div class="editor-image-focus__stage" :class="{ 'has-backdrop': cropPreview }">
      <img
        v-if="cropPreview"
        class="editor-image-focus__backdrop"
        :src="image"
        alt=""
        aria-hidden="true"
        draggable="false"
      />
      <div
        ref="preview"
        class="editor-image-focus__preview"
        :class="{ 'is-crop-preview': cropPreview }"
        :style="previewStyle"
        :aria-hidden="sliders ? 'true' : undefined"
        @pointerdown="startFocusDrag"
        @pointermove="moveFocus"
        @pointerup="endFocusDrag"
        @pointercancel="endFocusDrag"
        @click="handlePreviewClick"
      >
        <img
          :src="image"
          alt=""
          draggable="false"
          @load="updateImageSize"
          :style="{
            objectPosition: `${normalizedX}% ${normalizedY}%`,
          }"
        />

        <template v-if="cropPreview">
          <span
            v-for="(shade, index) in cropShades"
            :key="index"
            class="editor-image-focus__crop-shade"
            :style="shade"
            aria-hidden="true"
          ></span>

          <span
            class="editor-image-focus__crop-window"
            :style="cropWindowStyle"
            aria-hidden="true"
          >
            <i class="editor-image-focus__crop-corner is-top-left"></i>
            <i class="editor-image-focus__crop-corner is-top-right"></i>
            <i class="editor-image-focus__crop-corner is-bottom-left"></i>
            <i class="editor-image-focus__crop-corner is-bottom-right"></i>
          </span>
        </template>

        <span
          v-else
          class="editor-image-focus__point"
          :style="{
            left: `${normalizedX}%`,
            top: `${normalizedY}%`,
          }"
        ></span>
      </div>
    </div>

    <p class="editor-image-focus__hint">
      {{ cropHint }}
    </p>

    <template v-if="sliders">
      <div class="editor-image-focus__control">
        <div class="editor-image-focus__label">
          {{ cropPreview
            ? (canCropHorizontally ? 'Recorte horizontal' : 'Sin recorte lateral')
            : 'Horizontal' }}
          <span v-if="cropPreview && !canCropHorizontally">No aplica</span>
          <span v-else>{{ Math.round(normalizedX) }}%</span>
        </div>
        <input
          type="range"
          class="form-range"
          min="0"
          max="100"
          step="1"
          :value="normalizedX"
          :disabled="cropPreview && !canCropHorizontally"
          data-edit-target=".imageFocusX"
          :aria-label="cropPreview ? 'Recorte horizontal' : 'Punto focal horizontal'"
          @input="updateFocusX"
        />
      </div>

      <div class="editor-image-focus__control">
        <div class="editor-image-focus__label">
          {{ cropPreview
            ? (canCropVertically ? 'Recorte vertical' : 'Sin recorte vertical')
            : 'Vertical' }}
          <span v-if="cropPreview && !canCropVertically">No aplica</span>
          <span v-else>{{ Math.round(normalizedY) }}%</span>
        </div>
        <input
          type="range"
          class="form-range"
          min="0"
          max="100"
          step="1"
          :value="normalizedY"
          :disabled="cropPreview && !canCropVertically"
          data-edit-target=".imageFocusY"
          :aria-label="cropPreview ? 'Recorte vertical' : 'Punto focal vertical'"
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
      {{ cropPreview ? 'Centrar recorte' : 'Centrar punto focal' }}
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
import { computed, ref, watch } from 'vue';

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
    /** Muestra la imagen completa y marca encima el área que se recortará. */
    cropPreview?: boolean;
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
    cropPreview: false,
  },
);

const emit = defineEmits<{
  (event: 'update:focusX', value: number): void;
  (event: 'update:focusY', value: number): void;
}>();

const preview = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const imageSize = ref<{ width: number; height: number } | null>(null);

const normalizeFocus = (value: number): number =>
  Number.isFinite(Number(value))
    ? Math.min(100, Math.max(0, Number(value)))
    : 50;

const normalizedX = computed(() => normalizeFocus(props.focusX));
const normalizedY = computed(() => normalizeFocus(props.focusY));

/*
 * Con proporción: la caja la manda `aspect-ratio`, y si el alto saldría mayor que
 * `maxHeight` se acota el ANCHO (limitar solo el alto deformaría la proporción) y
 * se centra. Sin proporción, alto fijo.
 */
const ratioValue = (ratio?: string): number => {
  if (!ratio) return 0;
  const [w, h] = ratio.split('/').map((part) => Number(part.trim()));
  return w > 0 && h > 0 ? w / h : 0;
};

const imageAspectRatio = computed(() =>
  imageSize.value ? imageSize.value.width / imageSize.value.height : 0,
);

const cropGeometry = computed(() => {
  const imageRatio = imageAspectRatio.value;
  const frameRatio = ratioValue(props.ratio);
  let width = 100;
  let height = 100;

  if (imageRatio > 0 && frameRatio > 0 && imageRatio > frameRatio) {
    width = (frameRatio / imageRatio) * 100;
  } else if (imageRatio > 0 && frameRatio > 0 && imageRatio < frameRatio) {
    height = (imageRatio / frameRatio) * 100;
  }

  const availableX = 100 - width;
  const availableY = 100 - height;

  return {
    left: (availableX * normalizedX.value) / 100,
    top: (availableY * normalizedY.value) / 100,
    width,
    height,
  };
});

const cropWindowStyle = computed(() => ({
  left: `${cropGeometry.value.left}%`,
  top: `${cropGeometry.value.top}%`,
  width: `${cropGeometry.value.width}%`,
  height: `${cropGeometry.value.height}%`,
}));

const canCropHorizontally = computed(() => cropGeometry.value.width < 99.99);
const canCropVertically = computed(() => cropGeometry.value.height < 99.99);

const cropHint = computed(() => {
  if (!props.cropPreview) {
    return 'Haz clic o arrastra el punto para ajustar el encuadre.';
  }

  if (!canCropHorizontally.value && !canCropVertically.value) {
    return 'La proporción de la imagen ya coincide con este marco; no hace falta recortarla.';
  }
  if (!canCropHorizontally.value) {
    return 'La foto completa está visible. Haz clic o arrastra el marco arriba o abajo para elegir el área.';
  }
  if (!canCropVertically.value) {
    return 'La foto completa está visible. Haz clic o arrastra el marco a los lados para elegir el área.';
  }

  return 'La foto completa está visible. Haz clic o arrastra el marco para elegir qué área se mostrará.';
});

const cropShades = computed(() => {
  const { left, top, width, height } = cropGeometry.value;
  const right = left + width;
  const bottom = top + height;

  return [
    { left: '0', top: '0', width: '100%', height: `${top}%` },
    { left: '0', top: `${bottom}%`, width: '100%', height: `${100 - bottom}%` },
    { left: '0', top: `${top}%`, width: `${left}%`, height: `${height}%` },
    { left: `${right}%`, top: `${top}%`, width: `${100 - right}%`, height: `${height}%` },
  ];
});

const previewStyle = computed(() => {
  if (props.cropPreview) {
    if (!imageAspectRatio.value || !imageSize.value) {
      return {
        width: '100%',
        height: `${props.maxHeight}px`,
        margin: '0 auto',
      };
    }

    return {
      aspectRatio: `${imageSize.value.width} / ${imageSize.value.height}`,
      width: `min(100%, ${Math.round(props.maxHeight * imageAspectRatio.value)}px)`,
      margin: '0 auto',
    };
  }

  if (!props.ratio) return { height: `${props.height}px` };

  const value = ratioValue(props.ratio);

  return {
    aspectRatio: props.ratio,
    width: value ? `min(100%, ${Math.round(props.maxHeight * value)}px)` : '100%',
    margin: '0 auto',
  };
});

const updateImageSize = (event: Event) => {
  const imageElement = event.target as HTMLImageElement;
  if (!imageElement.naturalWidth || !imageElement.naturalHeight) return;

  imageSize.value = {
    width: imageElement.naturalWidth,
    height: imageElement.naturalHeight,
  };
};

watch(
  () => props.image,
  () => {
    imageSize.value = null;
  },
);

const updateFromPointer = (event: MouseEvent | PointerEvent) => {
  const element = preview.value;
  if (!element) return;

  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  if (props.cropPreview) {
    const contentLeft = rect.left + element.clientLeft;
    const contentTop = rect.top + element.clientTop;
    const { width, height } = cropGeometry.value;
    const availableX = 100 - width;
    const availableY = 100 - height;

    if (availableX > 0 && element.clientWidth > 0) {
      const pointerX = ((event.clientX - contentLeft) / element.clientWidth) * 100;
      emit('update:focusX', normalizeFocus(((pointerX - width / 2) / availableX) * 100));
    }
    if (availableY > 0 && element.clientHeight > 0) {
      const pointerY = ((event.clientY - contentTop) / element.clientHeight) * 100;
      emit('update:focusY', normalizeFocus(((pointerY - height / 2) / availableY) * 100));
    }

    return;
  }

  emit(
    'update:focusX',
    normalizeFocus(((event.clientX - rect.left) / rect.width) * 100),
  );
  emit(
    'update:focusY',
    normalizeFocus(((event.clientY - rect.top) / rect.height) * 100),
  );
};

const handlePreviewClick = (event: MouseEvent) => {
  if (props.cropPreview) updateFromPointer(event);
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
/* El recuadro ocupa siempre todo el ancho; la vista previa va centrada dentro. */
.editor-image-focus__stage {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  overflow: hidden;
  border-radius: 7px;
}

.editor-image-focus__stage.has-backdrop {
  background: #e9edf3;
}

/*
 * `scale` tapa el borde que deja el desenfoque (el blur difumina hacia afuera y
 * deja un halo claro en los extremos).
 */
.editor-image-focus__backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(14px) brightness(0.92);
  transform: scale(1.15);
  pointer-events: none;
  user-select: none;
}

/* Ancho completo por defecto (ahora es hijo flex del recuadro); el inline lo acota. */
.editor-image-focus__preview {
  position: relative;
  z-index: 1;
  width: 100%;
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

.editor-image-focus__preview.is-crop-preview {
  cursor: move;
}

.editor-image-focus__preview.is-crop-preview img {
  object-fit: contain;
}

.editor-image-focus__crop-shade {
  position: absolute;
  z-index: 1;
  background: rgba(10, 19, 25, 0.56);
  pointer-events: none;
}

.editor-image-focus__crop-window {
  position: absolute;
  z-index: 2;
  box-sizing: border-box;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px rgba(10, 19, 25, 0.4);
  pointer-events: none;
}

.editor-image-focus__crop-corner {
  position: absolute;
  width: 9px;
  height: 9px;
  border: 2px solid #fff;
  background: rgba(10, 19, 25, 0.35);
}

.editor-image-focus__crop-corner.is-top-left {
  top: -5px;
  left: -5px;
}

.editor-image-focus__crop-corner.is-top-right {
  top: -5px;
  right: -5px;
}

.editor-image-focus__crop-corner.is-bottom-left {
  bottom: -5px;
  left: -5px;
}

.editor-image-focus__crop-corner.is-bottom-right {
  right: -5px;
  bottom: -5px;
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
