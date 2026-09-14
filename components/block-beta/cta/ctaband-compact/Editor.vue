<template>
  <div class="cta-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Texto</h6>
    <p class="cta-hint">
      Banner delgado pensado para insertarse dentro de una columna de contenido,
      no a todo el ancho de la página.
    </p>

    <label class="form-label">Título</label>
    <textarea v-model="localData.title" class="form-control form-control-sm mb-2" rows="2"></textarea>

    <label class="form-label">Descripción</label>
    <textarea v-model="localData.desc" class="form-control form-control-sm mb-3" rows="2"></textarea>

    <hr />

    <h6 class="fw-bold small text-uppercase mb-1">Ícono</h6>
    <p class="cta-hint">
      Se dibuja en un círculo a la izquierda. Déjalo vacío para quitarlo.
    </p>
    <input
      v-model="localData.icon"
      type="text"
      class="form-control form-control-sm mb-3"
      list="cta-compact-icons"
      placeholder="help-circle"
    />
    <datalist id="cta-compact-icons">
      <option v-for="name in ICON_SUGGESTIONS" :key="name" :value="name" />
    </datalist>

    <hr />

    <h6 class="fw-bold small text-uppercase mb-1">Enlace</h6>
    <p class="cta-hint">
      Esta variante no usa botones: lleva un enlace único con flecha, tal como
      está definida en el sistema de diseño. Si dejas el texto vacío, el enlace
      no se dibuja.
    </p>

    <label class="form-label">Texto del enlace</label>
    <input v-model="localData.linkLabel" type="text" class="form-control form-control-sm mb-2" />

    <label class="form-label">Destino</label>
    <input
      v-model="localData.linkUrl"
      type="text"
      class="form-control form-control-sm"
      placeholder="/ruta o https://"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * Editor del CTA Band compacto.
 */
import { ref, watch } from 'vue';
import { ICON_SUGGESTIONS } from '../_shared/iconOptions';

const props = defineProps<{
  modelValue: any;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);

const build = (source: any) => ({
  icon: source?.icon ?? '',
  title: source?.title ?? '',
  desc: source?.desc ?? '',
  linkLabel: source?.linkLabel ?? '',
  linkUrl: source?.linkUrl ?? '',
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
</style>
