<template>
  <div class="cta-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Texto</h6>
    <p class="cta-hint">
      El texto se sitúa a la izquierda, sobre la zona oscura de la franja.
      Deja vacío cualquier campo que no quieras mostrar.
    </p>

    <label class="form-label">Antetítulo</label>
    <p class="cta-hint">Línea corta sobre el título. Se muestra en mayúsculas.</p>
    <input v-model="localData.eyebrow" type="text" class="form-control form-control-sm mb-2" />

    <label class="form-label">Título</label>
    <textarea v-model="localData.title" class="form-control form-control-sm mb-2" rows="2"></textarea>

    <label class="form-label">Descripción</label>
    <textarea v-model="localData.desc" class="form-control form-control-sm mb-3" rows="3"></textarea>

    <hr />

    <h6 class="fw-bold small text-uppercase mb-1">Imagen de fondo</h6>
    <p class="cta-hint">
      Ocupa toda la franja. Un velo oscuro la cubre sobre el texto y se difumina
      hacia la derecha, así que la parte visible de la foto es la del extremo
      derecho: elige una imagen cuyo motivo quede por ese lado.
    </p>

    <div class="mb-2">
      <div class="cta-image-preview mb-2">
        <img v-if="localData.image" :src="localData.image" alt="" />
        <span v-else class="text-muted small">Sin imagen seleccionada</span>
      </div>

      <div class="d-flex gap-2">
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary flex-grow-1"
          @click="$emit('select-image', { item: localData, field: 'image' })"
        >
          <i class="las la-image me-1"></i>
          {{ localData.image ? 'Cambiar imagen' : 'Subir imagen' }}
        </button>
        <button
          v-if="localData.image"
          type="button"
          class="btn btn-sm btn-outline-danger"
          title="Quitar imagen"
          @click="localData.image = ''"
        >
          <i class="las la-trash"></i>
        </button>
      </div>
    </div>

    <label class="form-label">Texto alternativo</label>
    <input
      v-model="localData.imageAlt"
      type="text"
      class="form-control form-control-sm mb-3"
      placeholder="Descripción de la imagen para accesibilidad"
    />

    <hr />

    <CtaActionsEditor
      :primary="localData.primary"
      :secondary="localData.secondary"
      :button-count="localData.buttonCount"
      @update:button-count="localData.buttonCount = $event"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * Editor del CTA Band con imagen.
 *
 * La imagen se elige con el selector de medios del constructor: se emite
 * `select-image` con el objeto y el campo a rellenar, y el modal escribe ahí
 * la URL resultante.
 */
import { ref, watch } from 'vue';
import CtaActionsEditor from '../_shared/CtaActionsEditor.vue';
import { normalizeAction, normalizeButtonCount } from '../_shared/types';

const props = defineProps<{
  modelValue: any;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);

const build = (source: any) => ({
  eyebrow: source?.eyebrow ?? '',
  title: source?.title ?? '',
  desc: source?.desc ?? '',
  image: source?.image ?? '',
  imageAlt: source?.imageAlt ?? '',
  buttonCount: normalizeButtonCount(source?.buttonCount),
  primary: normalizeAction(source?.primary),
  secondary: normalizeAction(source?.secondary),
});

const localData = ref(build(props.modelValue));

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) return;
    if (JSON.stringify(newVal) === JSON.stringify(localData.value)) return;
    localData.value = build(newVal);
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
.cta-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}

.cta-image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  border: 1px dashed #c6cedb;
  border-radius: 7px;
  background: #f4f6fa;
  overflow: hidden;
}

.cta-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
