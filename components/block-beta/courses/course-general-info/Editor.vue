<template>
  <div class="course-general-info-editor">
    <h6 class="fw-bold small text-uppercase mb-2">Encabezado</h6>

    <EditorText
      v-model="localData.title"
      data-edit-target="title"
      class="mb-3"
      label="Título de sección"
      :maxlength="rules.title.maxLength"
      placeholder="Datos Generales"
    />

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-1">
      <h6 class="fw-bold small text-uppercase m-0">Filas de datos</h6>
      <span class="badge bg-secondary">{{ localData.rows.length }}/{{ rules.maxRows }}</span>
    </div>
    <p class="text-muted small mb-2">
      En escritorio y tablet muestra etiqueta (240px) + valor horizontal; en móvil apilado.
    </p>

    <CardAccordionItem
      v-for="(row, index) in localData.rows"
      :key="row.id"
      :edit-key="`rows.${index}`"
      :title="row.label || `Dato ${index + 1}`"
      :index="index"
      :total="localData.rows.length"
      :open="openIndex === index"
      remove-label="Quitar fila"
      @toggle="toggle(index)"
      @move="moveRow(index, $event)"
      @remove="removeRow(index)"
    >
      <div>
        <EditorText
          v-model="row.label"
          data-edit-target=".label"
          class="mb-2"
          label="Etiqueta (columna izquierda)"
          :maxlength="rules.label.maxLength"
          placeholder="Fecha de inicio"
        />

        <EditorTextarea
          v-model="row.value"
          data-edit-target=".value"
          class="mb-2"
          label="Valor / Descripción"
          :rows="3"
          :maxlength="rules.value.maxLength"
          placeholder="31 de octubre de 2026"
        />

        <div class="mb-1">
          <label class="form-label small fw-semibold mb-1">Estilo tipográfico del valor</label>
          <select v-model="row.valueStyle" class="form-select form-select-sm">
            <option value="auto">Automático (corto = 18px Display · largo = 16px Párrafo)</option>
            <option value="display">Destacado (Bricolage 18px)</option>
            <option value="body">Párrafo (Inter 16px)</option>
          </select>
        </div>
      </div>
    </CardAccordionItem>

    <button
      v-if="localData.rows.length < rules.maxRows"
      type="button"
      class="btn btn-sm btn-danger w-100 mt-1 mb-3"
      @click="addRow"
    >
      <i class="las la-plus me-1"></i> Agregar fila de dato
    </button>

    <hr />

    <EditorTextarea
      v-model="localData.footnotes"
      data-edit-target="footnotes"
      label="Notas aclaratorias al pie"
      :rows="4"
      :maxlength="rules.footnotes.maxLength"
      hint="Cada salto de línea genera una nota independiente (*descuentos, **condiciones)."
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import {
  COURSE_GENERAL_INFO_RULES,
  normalizeCourseGeneralInfoData,
  type CourseGeneralInfoData,
} from './types';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);
const rules = COURSE_GENERAL_INFO_RULES;

const localData = reactive<CourseGeneralInfoData>(normalizeCourseGeneralInfoData(props.modelValue));
const openIndex = ref<number | null>(0);
let syncing = false;

watch(
  () => props.modelValue,
  (val) => {
    const next = normalizeCourseGeneralInfoData(val);
    if (JSON.stringify(next) === JSON.stringify(localData)) return;
    syncing = true;
    localData.title = next.title;
    localData.rows = next.rows;
    localData.footnotes = next.footnotes;
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

const addRow = () => {
  if (localData.rows.length >= rules.maxRows) return;
  localData.rows.push({
    id: `info-${Date.now().toString(36)}`,
    label: 'Nuevo campo',
    value: 'Detalle',
    valueStyle: 'auto',
  });
  openIndex.value = localData.rows.length - 1;
};

const removeRow = (index: number) => {
  localData.rows.splice(index, 1);
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};

const moveRow = (index: number, dir: number) => {
  const next = index + dir;
  if (next < 0 || next >= localData.rows.length) return;
  const [moved] = localData.rows.splice(index, 1);
  localData.rows.splice(next, 0, moved);
  openIndex.value = next;
};
</script>
