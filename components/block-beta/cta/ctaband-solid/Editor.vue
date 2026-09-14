<template>
  <div class="cta-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Texto</h6>
    <p class="cta-hint">
      Todo el contenido va centrado sobre el color de marca. Deja vacío
      cualquier campo que no quieras mostrar.
    </p>

    <label class="form-label">Antetítulo</label>
    <p class="cta-hint">Línea corta sobre el título. Se muestra en mayúsculas.</p>
    <input v-model="localData.eyebrow" type="text" class="form-control form-control-sm mb-2" />

    <label class="form-label">Título</label>
    <textarea v-model="localData.title" class="form-control form-control-sm mb-2" rows="2"></textarea>

    <label class="form-label">Descripción</label>
    <textarea v-model="localData.desc" class="form-control form-control-sm mb-3" rows="3"></textarea>

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
 * Editor del CTA Band sólido de marca.
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
</style>
