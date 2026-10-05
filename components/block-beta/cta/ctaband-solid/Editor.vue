<template>
  <div class="cta-editor">
    <h6 class="fw-bold small text-uppercase mb-1">Texto</h6>
    <p class="cta-hint">
      Todo el contenido va centrado sobre el color de marca. Deja vacío
      cualquier campo que no quieras mostrar.
    </p>

    <EditorText
      v-model="localData.eyebrow"
      data-edit-target="eyebrow"
      class="mb-2"
      label="Antetítulo"
      hint="Línea corta sobre el título. Se muestra en mayúsculas."
    />

    <EditorTextarea v-model="localData.title" data-edit-target="title" class="mb-2" label="Título" :rows="2" />

    <EditorTextarea v-model="localData.desc" data-edit-target="desc" class="mb-3" label="Descripción" :rows="3" />

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
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
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
