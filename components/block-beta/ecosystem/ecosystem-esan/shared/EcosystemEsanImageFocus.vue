<template>
  <div class="ees-image-focus">
    <div
      ref="preview"
      class="ees-image-focus__preview"
      aria-hidden="true"
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
        class="ees-image-focus__point"
        :style="{
          left: `${normalizedX}%`,
          top: `${normalizedY}%`,
        }"
      ></span>
    </div>

    <p class="ees-image-focus__hint">
      Haz clic o arrastra el punto para ajustar el encuadre.
    </p>

    <div class="ees-image-focus__control">
      <div class="ees-image-focus__label">
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

    <div class="ees-image-focus__control">
      <div class="ees-image-focus__label">
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

    <button
      type="button"
      class="btn btn-sm btn-link ees-image-focus__reset"
      @click="resetFocus"
    >
      Centrar punto focal
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    image: string;
    focusX?: number;
    focusY?: number;
  }>(),
  {
    focusX: 50,
    focusY: 50,
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
.ees-image-focus__preview {
  position: relative;
  height: 110px;
  overflow: hidden;
  border: 1px dashed #c6cedb;
  border-radius: 7px;
  background: #f4f6fa;
  cursor: crosshair;
  touch-action: none;
  user-select: none;
}

.ees-image-focus__preview img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
}

.ees-image-focus__point {
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

.ees-image-focus__point::before,
.ees-image-focus__point::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  background: #fff;
  transform: translate(-50%, -50%);
}

.ees-image-focus__point::before {
  width: 8px;
  height: 2px;
}

.ees-image-focus__point::after {
  width: 2px;
  height: 8px;
}

.ees-image-focus__hint {
  margin: 5px 0 8px;
  color: #6b7688;
  font-size: 11px;
  line-height: 1.4;
}

.ees-image-focus__control {
  margin-bottom: 4px;
}

.ees-image-focus__label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0;
  color: #6b7688;
  font-size: 11px;
}

.ees-image-focus__control .form-range {
  margin-bottom: 0;
}

.ees-image-focus__reset {
  padding: 0;
  font-size: 11px;
  text-decoration: none;
}
</style>
