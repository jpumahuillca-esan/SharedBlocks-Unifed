<template>
  <div class="malla-editor">
    <h6 class="fw-bold small text-uppercase mb-2">Encabezado</h6>

    <EditorText
      v-model="localData.eyebrow"
      data-edit-target="eyebrow"
      class="mb-2"
      label="Antetítulo"
      placeholder="Diez ciclos y 200 créditos"
    />

    <EditorText
      v-model="localData.title"
      data-edit-target="title"
      class="mb-2"
      label="Título principal"
      placeholder="Malla curricular"
    />

    <EditorTextarea
      v-model="localData.desc"
      data-edit-target="desc"
      class="mb-2"
      label="Descripción"
      :rows="3"
      placeholder="Diez ciclos organizados en cinco años..."
    />

    <hr class="my-3" />

    <div class="d-flex align-items-center justify-content-between mb-2">
      <h6 class="fw-bold small text-uppercase m-0">Años y Ciclos</h6>
      <span class="badge bg-secondary">{{ localData.years.length }}</span>
    </div>

    <div class="malla-years-list mb-3">
      <CardAccordionItem
        v-for="(year, yIndex) in localData.years"
        :key="year.id"
        :edit-key="`years.${yIndex}`"
        :title="`${year.number} - ${year.title || 'Año'}`"
        :index="yIndex"
        :total="localData.years.length"
        :open="openYearIndex === yIndex"
        @toggle="toggleYear(yIndex)"
        @move-up="moveYear(yIndex, -1)"
        @move-down="moveYear(yIndex, 1)"
        @remove="removeYear(yIndex)"
      >
        <div class="p-2">
          <div class="row g-2 mb-2">
            <div class="col-4">
              <EditorText
                v-model="year.number"
                label="Número"
                placeholder="01"
              />
            </div>
            <div class="col-8">
              <EditorText
                v-model="year.title"
                label="Nombre del año"
                placeholder="Primer año"
              />
            </div>
          </div>

          <h6 class="small fw-bold text-muted mt-3 mb-2">Ciclos Académicos</h6>

          <div
            v-for="(cycle, cIndex) in year.cycles"
            :key="cycle.id"
            class="card mb-2 p-2 bg-light border"
          >
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="fw-semibold small text-primary">{{ cycle.name || `Ciclo ${cIndex + 1}` }}</span>
              <button
                type="button"
                class="btn btn-sm btn-link text-danger p-0"
                @click="removeCycle(year, cIndex)"
              >
                <i class="las la-trash"></i>
              </button>
            </div>

            <EditorText
              v-model="cycle.name"
              label="Nombre del ciclo"
              placeholder="Ciclo 1"
              class="mb-2"
            />

            <EditorTextarea
              v-model="cycle.note"
              label="Nota opcional del ciclo"
              placeholder="Los cursos de Pre-Formación pueden ser convalidados..."
              :rows="2"
              class="mb-2"
            />

            <label class="form-label small fw-semibold mb-1">
              Cursos (uno por línea):
            </label>
            <textarea
              class="form-control form-control-sm font-monospace"
              rows="4"
              :value="coursesToText(cycle.courses)"
              placeholder="Análisis de Datos I&#10;Comunicación y Literatura I&#10;Filosofía y Ética"
              @input="updateCycleCourses(cycle, ($event.target as HTMLTextAreaElement).value)"
            ></textarea>
          </div>

          <button
            type="button"
            class="btn btn-sm btn-outline-secondary w-100 mt-2"
            @click="addCycle(year)"
          >
            <i class="las la-plus me-1"></i> Agregar ciclo a este año
          </button>
        </div>
      </CardAccordionItem>
    </div>

    <button
      type="button"
      class="btn btn-outline-primary btn-sm w-100 mb-3"
      @click="addYear"
    >
      <i class="las la-plus me-1"></i> Agregar año
    </button>

    <hr class="my-3" />

    <h6 class="fw-bold small text-uppercase mb-2">Aviso / Disclaimer</h6>

    <div class="form-check form-switch mb-2">
      <input
        id="malla-alert-toggle"
        v-model="localData.showAlert"
        type="checkbox"
        class="form-check-input"
      />
      <label for="malla-alert-toggle" class="form-check-label small fw-semibold">
        Mostrar aviso informativo
      </label>
    </div>

    <EditorText
      v-if="localData.showAlert"
      v-model="localData.alertText"
      label="Texto del aviso"
      placeholder="El plan de estudios puede tener cambios y modificaciones."
      class="mb-3"
    />

    <hr class="my-3" />

    <h6 class="fw-bold small text-uppercase mb-2">Descarga de Malla</h6>

    <div class="form-check form-switch mb-2">
      <input
        id="malla-download-toggle"
        v-model="localData.showDownload"
        type="checkbox"
        class="form-check-input"
      />
      <label for="malla-download-toggle" class="form-check-label small fw-semibold">
        Mostrar botón de descarga
      </label>
    </div>

    <template v-if="localData.showDownload">
      <EditorText
        v-model="localData.downloadLabel"
        label="Texto del botón"
        placeholder="Descargar malla curricular"
        class="mb-2"
      />

      <EditorUrl
        v-model="localData.downloadUrl"
        label="Enlace del archivo (PDF / brochure)"
        placeholder="https://.../malla-curricular.pdf"
        class="mb-2"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorTextarea from '../../../editor-beta/EditorTextarea/EditorTextarea.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import {
  buildMallaCurricularData,
  createMallaId,
  type MallaCurricularData,
  type MallaCycle,
  type MallaYear,
  type MallaCourse,
} from './shared/types';

const props = defineProps<{
  modelValue: Partial<MallaCurricularData> | any;
}>();

const emit = defineEmits(['update:modelValue']);

const localData = ref<MallaCurricularData>(buildMallaCurricularData(props.modelValue));
const openYearIndex = ref<number | null>(0);

const toggleYear = (index: number) => {
  openYearIndex.value = openYearIndex.value === index ? null : index;
};

const coursesToText = (courses: MallaCourse[]): string =>
  (courses || []).map((c) => c.name).join('\n');

const updateCycleCourses = (cycle: MallaCycle, text: string) => {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  cycle.courses = lines.map((name, i) => ({
    id: cycle.courses[i]?.id || createMallaId('course'),
    name,
  }));
};

const addYear = () => {
  const nextNum = String(localData.value.years.length + 1).padStart(2, '0');
  localData.value.years.push({
    id: createMallaId('year'),
    number: nextNum,
    title: `Año ${localData.value.years.length + 1}`,
    cycles: [],
  });
  openYearIndex.value = localData.value.years.length - 1;
};

const removeYear = (index: number) => {
  localData.value.years.splice(index, 1);
  if (openYearIndex.value === index) openYearIndex.value = null;
};

const moveYear = (index: number, delta: number) => {
  const target = index + delta;
  if (target < 0 || target >= localData.value.years.length) return;
  const item = localData.value.years.splice(index, 1)[0];
  localData.value.years.splice(target, 0, item);
  if (openYearIndex.value === index) openYearIndex.value = target;
};

const addCycle = (year: MallaYear) => {
  year.cycles.push({
    id: createMallaId('cycle'),
    name: `Ciclo ${year.cycles.length + 1}`,
    courses: [],
  });
};

const removeCycle = (year: MallaYear, index: number) => {
  year.cycles.splice(index, 1);
};

watch(
  localData,
  (val) => {
    emit('update:modelValue', JSON.parse(JSON.stringify(val)));
  },
  { deep: true },
);

watch(
  () => props.modelValue,
  (val) => {
    if (JSON.stringify(val) !== JSON.stringify(localData.value)) {
      localData.value = buildMallaCurricularData(val);
    }
  },
  { deep: true },
);
</script>

<style scoped>
.malla-editor {
  padding: 8px 0;
}
.malla-years-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>

