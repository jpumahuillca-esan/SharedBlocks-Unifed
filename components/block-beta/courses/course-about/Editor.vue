<template>
  <div class="course-about-editor">
    <h6 class="fw-bold small text-uppercase mb-2">Encabezado y descripción</h6>

    <EditorText
      v-model="localData.title"
      data-edit-target="title"
      class="mb-2"
      label="Título de sección"
      :maxlength="rules.title.maxLength"
      placeholder="Acerca del curso"
    />

    <EditorTextarea
      v-model="localData.description"
      data-edit-target="description"
      class="mb-3"
      label="Descripción del curso"
      :rows="6"
      :maxlength="rules.description.maxLength"
      hint="Separa párrafos con Enter doble. Usa **texto** para resaltar en negrita."
    />

    <hr />

    <h6 class="fw-bold small text-uppercase mb-2">Objetivos del curso</h6>

    <EditorText
      v-model="localData.objectivesTitle"
      data-edit-target="objectivesTitle"
      class="mb-2"
      label="Subtítulo de objetivos"
      :maxlength="rules.objectivesTitle.maxLength"
      placeholder="Objetivos del Curso"
    />

    <EditorTextarea
      v-model="localData.objectivesIntro"
      data-edit-target="objectivesIntro"
      class="mb-2"
      label="Texto introductorio"
      :rows="3"
      :maxlength="rules.objectivesIntro.maxLength"
      placeholder="Al final de este curso, esperamos que cada estudiante logre lo siguiente:"
      hint="Separa párrafos con Enter doble. Usa **texto** para resaltar en negrita."
    />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <span class="small fw-semibold">Lista de objetivos</span>
      <span class="badge bg-secondary">{{ localData.objectives.length }}</span>
    </div>

    <CardAccordionItem
      v-for="(item, index) in localData.objectives"
      :key="item.id"
      :edit-key="`objectives.${index}`"
      :title="item.text || `Objetivo ${index + 1}`"
      :index="index"
      :total="localData.objectives.length"
      :open="openList === 'objectives' && openIndex === index"
      remove-label="Quitar objetivo"
      @toggle="toggleItem('objectives', index)"
      @move="moveListItem('objectives', index, $event)"
      @remove="removeListItem('objectives', index)"
    >
      <EditorTextarea
        v-model="item.text"
        data-edit-target=".text"
        label="Objetivo"
        :rows="2"
        :maxlength="rules.objectiveText.maxLength"
        placeholder="Describe el logro o competencia esperada..."
      />
    </CardAccordionItem>

    <button type="button" class="btn btn-sm btn-danger w-100 mt-1 mb-3" @click="addObjective">
      <i class="las la-plus me-1"></i> Agregar objetivo
    </button>

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Tarjetas destacadas (pictogramas)</h6>
      <span class="badge bg-secondary">{{ localData.highlights.length }}/{{ rules.maxHighlights }}</span>
    </div>
    <p class="text-muted small mb-2">
      En Desktop y Tablet se muestran 4 en fila; en móvil en grilla 2×2.
    </p>

    <CardAccordionItem
      v-for="(card, index) in localData.highlights"
      :key="card.id"
      :edit-key="`highlights.${index}`"
      :title="card.text || `Diferencial ${index + 1}`"
      :index="index"
      :total="localData.highlights.length"
      :open="openList === 'highlights' && openIndex === index"
      remove-label="Quitar tarjeta"
      @toggle="toggleItem('highlights', index)"
      @move="moveListItem('highlights', index, $event)"
      @remove="removeListItem('highlights', index)"
    >
      <div>
        <EditorPictogram
          v-model="card.pictogram"
          data-edit-target=".pictogram"
          class="mb-2"
          label="Pictograma ESAN"
          :optional="false"
        />

        <EditorText
          v-model="card.text"
          data-edit-target=".text"
          label="Etiqueta"
          :maxlength="rules.highlightText.maxLength"
          placeholder="Reconocida plana docente"
        />
      </div>
    </CardAccordionItem>

    <button
      v-if="localData.highlights.length < rules.maxHighlights"
      type="button"
      class="btn btn-sm btn-outline-danger w-100 mt-1"
      @click="addHighlight"
    >
      <i class="las la-plus me-1"></i> Agregar tarjeta con pictograma
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorPictogram from '../../../editor-beta/EditorPictogram/EditorPictogram.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import {
  COURSE_ABOUT_RULES,
  normalizeCourseAboutData,
  type CourseAboutData,
} from './types';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);
const rules = COURSE_ABOUT_RULES;

const localData = ref<CourseAboutData>(normalizeCourseAboutData(props.modelValue));
let syncing = false;

watch(
  () => props.modelValue,
  (val) => {
    const next = normalizeCourseAboutData(val);
    if (JSON.stringify(next) === JSON.stringify(localData.value)) return;
    syncing = true;
    localData.value = next;
    syncing = false;
  },
  { deep: true },
);

watch(
  localData,
  (val) => {
    if (syncing) return;
    emit('update:modelValue', JSON.parse(JSON.stringify(val)));
  },
  { deep: true },
);

const openList = ref<'objectives' | 'highlights' | null>('objectives');
const openIndex = ref<number | null>(0);

const toggleItem = (list: 'objectives' | 'highlights', idx: number) => {
  if (openList.value === list && openIndex.value === idx) {
    openIndex.value = null;
    return;
  }
  openList.value = list;
  openIndex.value = idx;
};

const moveListItem = (list: 'objectives' | 'highlights', idx: number, dir: number) => {
  const arr = localData.value[list] as any[];
  const next = idx + dir;
  if (next < 0 || next >= arr.length) return;
  const copy = [...arr];
  const [picked] = copy.splice(idx, 1);
  copy.splice(next, 0, picked);
  (localData.value[list] as any[]) = copy;
  openList.value = list;
  openIndex.value = next;
};

const removeListItem = (list: 'objectives' | 'highlights', idx: number) => {
  const arr = localData.value[list] as any[];
  arr.splice(idx, 1);
  if (openList.value === list && openIndex.value === idx) {
    openIndex.value = null;
  }
};

const addObjective = () => {
  localData.value.objectives.push({
    id: `obj-${Date.now().toString(36)}`,
    text: 'Nuevo objetivo de aprendizaje.',
  });
  openList.value = 'objectives';
  openIndex.value = localData.value.objectives.length - 1;
};

const addHighlight = () => {
  if (localData.value.highlights.length >= rules.maxHighlights) return;
  localData.value.highlights.push({
    id: `hl-${Date.now().toString(36)}`,
    pictogram: 'faculty-group',
    text: 'Nuevo atributo',
  });
  openList.value = 'highlights';
  openIndex.value = localData.value.highlights.length - 1;
};
</script>
