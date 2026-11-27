<template>
  <div class="course-faculty-editor">
    <h6 class="fw-bold small text-uppercase mb-2">Encabezado</h6>

    <EditorText
      v-model="localData.title"
      data-edit-target="title"
      class="mb-3"
      label="Título de sección"
      :maxlength="rules.title.maxLength"
      placeholder="Docente"
    />

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Docentes</h6>
      <span class="badge bg-secondary">{{ localData.teachers.length }}/{{ rules.maxTeachers }}</span>
    </div>
    <p class="text-muted small mb-2">
      Tarjetas con borde izquierdo rojo ESAN, foto 100×100 redondeada (16px) y reseña académica.
    </p>

    <CardAccordionItem
      v-for="(teacher, index) in localData.teachers"
      :key="teacher.id"
      :edit-key="`teachers.${index}`"
      :title="teacher.name || `Docente ${index + 1}`"
      :index="index"
      :total="localData.teachers.length"
      :open="openIndex === index"
      remove-label="Quitar docente"
      @toggle="toggle(index)"
      @move="moveTeacher(index, $event)"
      @remove="removeTeacher(index)"
    >
      <div>
        <EditorImage
          v-model="teacher.image"
          v-model:alt="teacher.imageAlt"
          :focus-values="teacher.imageFocusProfiles"
          :focus-modes="imageFocusModes"
          focus-ratio="1 / 1"
          focus-crop-preview
          data-edit-target=".image"
          alt-edit-target=".imageAlt"
          class="mb-2"
          label="Fotografía del docente (100×100 px)"
          @select="$emit('select-image', { item: teacher, field: 'image' })"
          @update:focus-values="saveImageFocusProfiles(teacher, $event)"
        />

        <EditorText
          v-model="teacher.name"
          data-edit-target=".name"
          class="mb-2"
          label="Nombre completo"
          :maxlength="rules.name.maxLength"
          placeholder="Jorge Valerio Araoz"
        />

        <EditorTextarea
          v-model="teacher.bio"
          data-edit-target=".bio"
          class="mb-2"
          label="Reseña / Grado académico"
          :rows="4"
          :maxlength="rules.bio.maxLength"
          placeholder="Estudios de Maestría, especialización y experiencia relevante..."
        />

        <EditorUrl
          v-model="teacher.profileUrl"
          v-model:target="teacher.profileTarget"
          data-edit-target=".profileUrl"
          label="Enlace de perfil (opcional)"
          placeholder="https://... o /docentes/..."
        />
      </div>
    </CardAccordionItem>

    <button
      v-if="localData.teachers.length < rules.maxTeachers"
      type="button"
      class="btn btn-sm btn-danger w-100 mt-1"
      @click="addTeacher"
    >
      <i class="las la-plus me-1"></i> Agregar docente
    </button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import {
  createImageFocusModes,
  normalizeImageFocusProfiles,
  saveImageFocusProfiles,
} from '../../../../helpers/imageFocus';
import {
  COURSE_FACULTY_RULES,
  normalizeCourseFacultyData,
  type CourseFacultyData,
} from './types';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);
const rules = COURSE_FACULTY_RULES;
const imageFocusModes = createImageFocusModes('1 / 1');

const localData = reactive<CourseFacultyData>(normalizeCourseFacultyData(props.modelValue));
const openIndex = ref<number | null>(0);
let syncing = false;

watch(
  () => props.modelValue,
  (val) => {
    const next = normalizeCourseFacultyData(val);
    if (JSON.stringify(next) === JSON.stringify(localData)) return;
    syncing = true;
    localData.title = next.title;
    localData.teachers = next.teachers;
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

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addTeacher = () => {
  if (localData.teachers.length >= rules.maxTeachers) return;
  localData.teachers.push({
    id: `teacher-${Date.now().toString(36)}`,
    name: 'Nombre del docente',
    bio: 'Grado académico y experiencia profesional.',
    image: '',
    imageAlt: '',
    imageFocusX: 50,
    imageFocusY: 50,
    imageFocusProfiles: normalizeImageFocusProfiles(undefined, 50, 50),
    profileUrl: '',
    profileTarget: '',
  });
  openIndex.value = localData.teachers.length - 1;
};

const removeTeacher = (index: number) => {
  localData.teachers.splice(index, 1);
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};

const moveTeacher = (index: number, dir: number) => {
  const next = index + dir;
  if (next < 0 || next >= localData.teachers.length) return;
  const [moved] = localData.teachers.splice(index, 1);
  localData.teachers.splice(next, 0, moved);
  openIndex.value = next;
};
</script>
