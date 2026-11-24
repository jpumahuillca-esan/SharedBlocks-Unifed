<template>
  <div class="info-faq-editor">
    <h6 class="fw-bold small text-uppercase mb-2">Sección</h6>
    <EditorText v-model="localData.title" data-edit-target="title" label="Título" class="mb-3" />

    <hr />
    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Preguntas frecuentes</h6>
      <button type="button" class="btn btn-sm btn-outline-primary" @click="addItem">+ Agregar</button>
    </div>

    <CardAccordionItem
      v-for="(item, index) in localData.items"
      :key="item.id"
      :edit-key="`items.${index}`"
      :title="item.question || `Pregunta ${index + 1}`"
      :index="index"
      :total="localData.items.length"
      :open="openIndex === index"
      item-label="Pregunta"
      @toggle="openIndex = openIndex === index ? null : index"
      @move="moveItem(index, $event)"
      @remove="removeItem(index)"
    >
      <EditorText v-model="item.question" data-edit-target=".question" label="Pregunta" class="mb-2" />
      <EditorTextarea v-model="item.answer" data-edit-target=".answer" label="Respuesta" :rows="3" />
    </CardAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import { createQuestion, normalizeFrequentlyAskedQuestions, type FrequentlyAskedQuestionsData } from './shared/types';

const props = defineProps<{ modelValue?: Partial<FrequentlyAskedQuestionsData> }>();
const emit = defineEmits<{ (event: 'update:modelValue', value: FrequentlyAskedQuestionsData): void }>();
const localData = ref(normalizeFrequentlyAskedQuestions(props.modelValue));
const openIndex = ref<number | null>(null);

const addItem = () => {
  localData.value.items.push(createQuestion());
  openIndex.value = localData.value.items.length - 1;
};

const removeItem = (index: number) => {
  localData.value.items.splice(index, 1);
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};

const moveItem = (index: number, delta: number) => {
  const target = index + delta;
  if (target < 0 || target >= localData.value.items.length) return;
  [localData.value.items[index], localData.value.items[target]] = [localData.value.items[target], localData.value.items[index]];
  if (openIndex.value === index) openIndex.value = target;
  else if (openIndex.value === target) openIndex.value = index;
};

watch(() => props.modelValue, (value) => {
  const next = normalizeFrequentlyAskedQuestions(value);
  if (JSON.stringify(next) !== JSON.stringify(localData.value)) localData.value = next;
}, { deep: true });
watch(localData, (value) => emit('update:modelValue', JSON.parse(JSON.stringify(value))), { deep: true });
</script>
