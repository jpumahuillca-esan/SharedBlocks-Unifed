<template>
  <div class="awards-v2-editor">
    <CardSectionHeaderEditor
      :eyebrow="localData.eyebrow"
      eyebrow-label="Antetítulo"
      eyebrow-hint="Se muestra con un guion largo al inicio."
      :desc="localData.desc"
      :title="localData.title"
      :link-label="localData.linkLabel"
      :link-url="localData.linkUrl"
      :link-target="localData.linkTarget"
      @update:eyebrow="localData.eyebrow = $event"
      @update:desc="localData.desc = $event"
      @update:title="localData.title = $event"
      @update:link-label="localData.linkLabel = $event"
      @update:link-url="localData.linkUrl = $event"
      @update:link-target="localData.linkTarget = $event"
    >
      <template #title>
        <div class="awards-title-editor mb-2" data-edit-target="title">
          <label class="form-label">Título de la sección</label>
          <QuillEditor
            v-model:content="localData.title"
            content-type="html"
            theme="snow"
            :toolbar="titleToolbar"
            placeholder="Indicadores de excelencia ESAN"
          />
        </div>
      </template>
    </CardSectionHeaderEditor>

    <hr />

    <EditorBrandColor
      v-model="localData.backgroundColorToken"
      data-edit-target="backgroundColorToken"
      label="Color de fondo"
      class="mb-3"
    />

    <EditorTextarea
      v-model="localData.bottomText"
      data-edit-target="bottomText"
      class="mb-3"
      label="Texto debajo del carrusel"
      hint="Se muestra en blanco después de los reconocimientos."
      :rows="3"
      placeholder="Texto complementario"
    />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Reconocimientos</h6>
      <span class="badge bg-secondary">{{ localData.awards.length }} / {{ MAX_AWARDS }}</span>
    </div>

    <CardAccordionItem
      v-for="(award, index) in localData.awards"
      :edit-key="`awards.${index}`"
      :key="award.id"
      :title="headLabel(award)"
      :index="index"
      :total="localData.awards.length"
      :open="openIndex === index"
      remove-label="Quitar reconocimiento"
      @toggle="toggle(index)"
      @move="moveAward(index, $event)"
      @remove="removeAward(index)"
    >
      <EditorImage
        v-model="award.image"
        v-model:alt="award.imageAlt"
        data-edit-target=".image"
        alt-edit-target=".imageAlt"
        label="Logo"
        fit="contain"
        alt-hint="El nombre del reconocimiento, tal como se lee en el logo. Lo usan los buscadores y los lectores de pantalla."
        alt-hint-position="top"
        alt-placeholder="N.º 1 en QS Executive MBA Rankings 2026"
        @select="$emit('select-image', { item: award, field: 'image' })"
      />
    </CardAccordionItem>

    <button type="button" class="btn btn-sm btn-danger w-100" :disabled="isFull" @click="addAward">
      <i class="las la-plus me-1"></i>
      {{ isFull ? `Máximo ${MAX_AWARDS} reconocimientos` : 'Agregar reconocimiento' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import CardSectionHeaderEditor from '../../events/_shared/CardSectionHeaderEditor.vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorBrandColor from '../../../editor-beta/EditorBrandColor/EditorBrandColor.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import { normalizeBrandColorToken } from '../../../editor-beta/EditorBrandColor/brandColors';
import { normalizeLinkTarget } from '../../../../helpers/linkTarget';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const MAX_AWARDS = 4;
const titleToolbar = [[{ color: ['#E3173E', '#4F5A6C', '#000000', false] }]];

interface AwardItem {
  id: string;
  image: string;
  imageAlt: string;
}

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);
const newAwardId = () => `aw-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const buildAward = (source: any): AwardItem => ({
  id: source?.id || newAwardId(),
  image: source?.image ?? '',
  imageAlt: source?.imageAlt ?? '',
});

const build = (source: any) => ({
  eyebrow: source?.eyebrow ?? '',
  title: source?.title ?? '',
  desc: source?.desc ?? '',
  linkLabel: source?.linkLabel ?? '',
  linkUrl: source?.linkUrl ?? '',
  linkTarget: normalizeLinkTarget(source?.linkTarget),
  bottomText: source?.bottomText ?? '',
  backgroundColorToken: normalizeBrandColorToken(source?.backgroundColorToken),
  awards: Array.isArray(source?.awards) ? source.awards.slice(0, MAX_AWARDS).map(buildAward) : [],
});

const localData = ref(build(props.modelValue));
const isFull = computed(() => localData.value.awards.length >= MAX_AWARDS);
const headLabel = (award: AwardItem) =>
  award.imageAlt.trim() || (award.image ? 'Sin texto alternativo' : 'Sin imagen');
const openIndex = ref<number | null>(null);
const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};
const addAward = () => {
  if (isFull.value) return;
  localData.value.awards.push(buildAward({}));
  openIndex.value = localData.value.awards.length - 1;
};
const removeAward = (index: number) => {
  localData.value.awards.splice(index, 1);
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};
const moveAward = (index: number, delta: number) => {
  const target = index + delta;
  const list = localData.value.awards;
  if (target < 0 || target >= list.length) return;
  [list[index], list[target]] = [list[target], list[index]];
  if (openIndex.value === index) openIndex.value = target;
  else if (openIndex.value === target) openIndex.value = index;
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal || JSON.stringify(newVal) === JSON.stringify(localData.value)) return;
    localData.value = build(newVal);
  },
  { deep: true },
);

watch(localData, (newVal) => emit('update:modelValue', JSON.parse(JSON.stringify(newVal))), { deep: true });
</script>

<style scoped>
.awards-title-editor :deep(.ql-toolbar.ql-snow) {
  border-radius: 4px 4px 0 0;
}

.awards-title-editor :deep(.ql-container.ql-snow),
.awards-title-editor :deep(.ql-editor) {
  min-height: 74px;
}

.awards-title-editor :deep(.ql-container.ql-snow) {
  border-radius: 0 0 4px 4px;
}

.awards-title-editor :deep(.ql-editor) {
  font-family: var(--ds-font-family-base);
}
</style>