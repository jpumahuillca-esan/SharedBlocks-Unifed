<template>
  <div class="course-related-editor">
    <h6 class="fw-bold small text-uppercase mb-2">Encabezado</h6>

    <EditorText
      v-model="localData.title"
      data-edit-target="title"
      class="mb-3"
      label="Título de sección"
      :maxlength="rules.title.maxLength"
      placeholder="Cursos relacionados"
    />

    <div class="mb-3">
      <label class="form-label small fw-bold d-block">Origen de los cursos</label>
      <div class="btn-group w-100" role="group" aria-label="Origen de los cursos">
        <button
          type="button"
          class="btn btn-sm"
          :class="localData.sourceMode === 'api' ? 'btn-secondary' : 'btn-outline-secondary'"
          @click="localData.sourceMode = 'api'"
        >
          Dinámico (Fastify API)
        </button>
        <button
          type="button"
          class="btn btn-sm"
          :class="localData.sourceMode === 'manual' ? 'btn-secondary' : 'btn-outline-secondary'"
          @click="localData.sourceMode = 'manual'"
        >
          Curación manual
        </button>
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label small fw-bold d-block">Columnas en escritorio</label>
      <div class="btn-group w-100" role="group" aria-label="Columnas">
        <button
          type="button"
          class="btn btn-sm"
          :class="localData.columns === 2 ? 'btn-secondary' : 'btn-outline-secondary'"
          @click="localData.columns = 2"
        >
          2 columnas (Figma detalle)
        </button>
        <button
          type="button"
          class="btn btn-sm"
          :class="localData.columns === 3 ? 'btn-secondary' : 'btn-outline-secondary'"
          @click="localData.columns = 3"
        >
          3 columnas (sin flotante)
        </button>
      </div>
      <p class="cr-hint mt-1">
        En secciones con columna flotante se fija automáticamente en máximo 2 tarjetas visibles.
      </p>
    </div>

    <hr />

    <template v-if="localData.sourceMode === 'api'">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <h6 class="fw-bold small text-uppercase mb-0">
          Consulta en vivo (<code>/api/public/courses</code>)
        </h6>
        <span v-if="loadingCategories" class="spinner-border spinner-border-sm text-danger" role="status"></span>
      </div>

      <div class="mb-3">
        <div class="d-flex align-items-center justify-content-between mb-1">
          <label class="form-label small fw-semibold mb-0">Unidad Académica</label>
          <button
            v-if="pageAcademicUnitId && localData.academic_unit_id !== pageAcademicUnitId"
            type="button"
            class="btn btn-link btn-sm p-0 text-decoration-none"
            style="font-size: 11px;"
            @click="applyPageUnit"
          >
            Usar unidad de esta página
          </button>
        </div>

        <select
          v-model="localData.academic_unit_id"
          class="form-select form-select-sm mb-2"
          @change="onUnitSelected"
        >
          <option :value="null">Todas las unidades académicas</option>
          <option v-for="unit in academicUnits" :key="unit.id" :value="unit.id">
            {{ unit.name }} {{ unit.full_slug ? `(${unit.full_slug})` : unit.slug ? `(/${unit.slug})` : '' }}
          </option>
        </select>

        <EditorText
          v-model="localData.unit_slug"
          label="Slug o ruta de unidad (opcional)"
          placeholder="universidad/extended-learning"
        />
      </div>

      <div class="mb-3">
        <label class="form-label small fw-semibold d-block mb-1">Tipos de oferta</label>
        <div class="d-flex flex-wrap gap-2">
          <label
            v-for="opt in COURSE_TYPE_OPTIONS"
            :key="opt.value"
            class="cr-type-pill"
            :class="{ 'is-active': localData.course_types.includes(opt.value) }"
          >
            <input
              type="checkbox"
              class="d-none"
              :checked="localData.course_types.includes(opt.value)"
              @change="toggleCourseType(opt.value, ($event.target as HTMLInputElement).checked)"
            />
            {{ opt.label }}
          </label>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label small fw-semibold mb-1">Categoría / Área (opcional)</label>
        <select
          v-if="categories.length > 0"
          v-model="localData.category_slug"
          class="form-select form-select-sm mb-2"
        >
          <option value="">Todas las áreas</option>
          <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">
            {{ cat.name }} ({{ cat.courses_count ?? 0 }})
          </option>
        </select>

        <EditorText
          v-model="localData.category_slug"
          label="Slug de categoría (opcional)"
          placeholder="data-analysis-y-estadistica"
        />
      </div>

      <div class="mb-3">
        <label class="form-label small fw-semibold" for="cr-limit">
          Máximo de cursos relacionados ({{ localData.limit }})
        </label>
        <input
          id="cr-limit"
          v-model.number="localData.limit"
          type="range"
          class="form-range"
          :min="rules.minLimit"
          :max="rules.maxLimit"
          step="1"
        />
      </div>
    </template>

    <template v-else>
      <div class="d-flex align-items-center justify-content-between mb-1">
        <h6 class="fw-bold small text-uppercase m-0">Tarjetas manuales</h6>
        <span class="badge bg-secondary">{{ localData.items.length }}/{{ rules.maxManualItems }}</span>
      </div>
      <p class="text-muted small mb-2">
        Usa tarjetas manuales si deseas fijar exactamente qué cursos mostrar en el carrusel.
      </p>

      <CardAccordionItem
        v-for="(item, index) in localData.items"
        :key="item.id"
        :edit-key="`items.${index}`"
        :title="item.title || `Curso ${index + 1}`"
        :index="index"
        :total="localData.items.length"
        :open="openIndex === index"
        remove-label="Quitar curso"
        @toggle="toggleItem(index)"
        @move="moveItem(index, $event)"
        @remove="removeItem(index)"
      >
        <div>
          <EditorImage
            v-model="item.image"
            v-model:alt="item.imageAlt"
            :focus-values="item.imageFocusProfiles"
            :focus-modes="imageFocusModes"
            focus-ratio="16 / 10"
            focus-crop-preview
            data-edit-target=".image"
            alt-edit-target=".imageAlt"
            class="mb-2"
            label="Imagen de portada"
            @select="$emit('select-image', { item, field: 'image' })"
            @update:focus-values="saveImageFocusProfiles(item, $event)"
          />

          <EditorText
            v-model="item.title"
            class="mb-2"
            label="Título del curso"
            placeholder="Python - Nivel I"
          />

          <EditorText
            v-model="item.start_date"
            class="mb-2"
            label="Fecha de inicio (YYYY-MM-DD)"
            placeholder="2026-10-16"
          />

          <EditorText
            v-model="item.modality"
            class="mb-2"
            label="Modalidad"
            placeholder="Virtual síncrona"
          />

          <EditorText
            v-model="item.schedule_text"
            class="mb-2"
            label="Clases / Horario"
            placeholder="Martes y jueves de 7:00 pm. a 10:00 pm."
          />

          <EditorText
            v-model="item.duration_label"
            class="mb-2"
            label="Duración"
            placeholder="8 clases - 24 horas académicas"
          />

          <EditorUrl
            v-model="item.url"
            v-model:target="item.target"
            class="mb-2"
            label="Enlace de 'Conoce más'"
            placeholder="/universidad/extended-learning/cursos/python-nivel-i/"
            :sections="availableSections"
          />

          <EditorText
            v-model="item.syllabus_path"
            label="PDF o ruta de temario (opcional)"
            placeholder="/storage/syllabi/curso.pdf"
          />
        </div>
      </CardAccordionItem>

      <button
        v-if="localData.items.length < rules.maxManualItems"
        type="button"
        class="btn btn-sm btn-danger w-100 mt-1 mb-3"
        @click="addItem"
      >
        <i class="las la-plus me-1"></i> Agregar curso relacionado
      </button>
    </template>

    <hr />

    <h6 class="fw-bold small text-uppercase mb-2">Etiquetas de botones</h6>

    <EditorText
      v-model="localData.primaryCtaLabel"
      class="mb-2"
      label="Botón principal"
      :maxlength="rules.primaryCtaLabel.maxLength"
      placeholder="Conoce más"
    />

    <EditorText
      v-model="localData.syllabusCtaLabel"
      label="Enlace secundario"
      :maxlength="rules.syllabusCtaLabel.maxLength"
      placeholder="Ver temario"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * Editor CMS para Cursos Relacionados (modo dinámico API o curación manual).
 */
import { onMounted, ref, watch } from 'vue';
import CardAccordionItem from '../../events/_shared/CardAccordionItem.vue';
import EditorImage from '../../../editor-beta/EditorImage/EditorImage.vue';
import EditorText from '../../../editor-beta/EditorText/EditorText.vue';
import EditorUrl from '../../../editor-beta/EditorUrl/EditorUrl.vue';
import { PUBLIC_API_URL } from '../../../../config/apiConfig';
import { useBreadcrumb } from '../../../../composables/useBreadcrumb';
import {
  createImageFocusModes,
  normalizeImageFocusProfiles,
  saveImageFocusProfiles,
} from '../../../../helpers/imageFocus';
import { COURSE_TYPE_OPTIONS } from '../course-catalog/types';
import {
  COURSE_RELATED_RULES,
  normalizeCourseRelatedData,
  type CourseRelatedData,
} from './types';

interface CourseCategoryOption {
  id: number;
  name: string;
  slug: string;
  courses_count?: number;
}

const props = defineProps<{
  modelValue?: Partial<CourseRelatedData>;
  pageAcademicUnitId?: number | null;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);

const rules = COURSE_RELATED_RULES;
const imageFocusModes = createImageFocusModes('16 / 10');
const { academicUnits, fetchAcademicUnits } = useBreadcrumb();
const categories = ref<CourseCategoryOption[]>([]);
const loadingCategories = ref(false);
const localData = ref<CourseRelatedData>(normalizeCourseRelatedData(props.modelValue));
const openIndex = ref<number | null>(0);
let syncing = false;

const loadCategories = async () => {
  loadingCategories.value = true;
  try {
    const params = new URLSearchParams();
    if (localData.value.academic_unit_id) {
      params.set('academic_unit_id', String(localData.value.academic_unit_id));
    } else if (localData.value.unit_slug) {
      params.set('unit_slug', localData.value.unit_slug);
    }
    if (localData.value.course_types.length > 0) {
      params.set('course_types', localData.value.course_types.join(','));
    }

    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${PUBLIC_API_URL}/courses/categories${qs}`);
    if (res.ok) {
      const json = await res.json();
      categories.value = Array.isArray(json?.data) ? json.data : [];
    }
  } catch {
    // Mantiene entrada manual si Fastify local no responde en edición offline
  } finally {
    loadingCategories.value = false;
  }
};

const toggleCourseType = (typeValue: string, checked: boolean) => {
  const next = new Set(localData.value.course_types);
  if (checked) next.add(typeValue);
  else next.delete(typeValue);
  localData.value.course_types = Array.from(next);
  localData.value.course_type = localData.value.course_types.join(',');
  loadCategories();
};

const onUnitSelected = () => {
  const unit = academicUnits.value.find(
    (u) => Number(u.id) === Number(localData.value.academic_unit_id),
  );
  localData.value.unit_slug = unit?.full_slug
    ? unit.full_slug.replace(/^\/+|\/+$/g, '')
    : unit?.slug || '';
  loadCategories();
};

const applyPageUnit = () => {
  if (!props.pageAcademicUnitId) return;
  localData.value.academic_unit_id = Number(props.pageAcademicUnitId);
  onUnitSelected();
};

const toggleItem = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const addItem = () => {
  if (localData.value.items.length >= rules.maxManualItems) return;
  localData.value.items.push({
    id: `rel-${Date.now().toString(36)}`,
    title: 'Nuevo curso relacionado',
    image: '',
    imageAlt: '',
    imageFocusX: 50,
    imageFocusY: 50,
    imageFocusProfiles: normalizeImageFocusProfiles(undefined, 50, 50),
    start_date: '',
    modality: 'Presencial',
    schedule_text: '',
    duration_label: '',
    url: '',
    target: '',
    syllabus_path: '',
  });
  openIndex.value = localData.value.items.length - 1;
};

const removeItem = (index: number) => {
  localData.value.items.splice(index, 1);
  if (openIndex.value === index) openIndex.value = null;
  else if (openIndex.value !== null && openIndex.value > index) openIndex.value -= 1;
};

const moveItem = (index: number, dir: number) => {
  const next = index + dir;
  if (next < 0 || next >= localData.value.items.length) return;
  const [moved] = localData.value.items.splice(index, 1);
  localData.value.items.splice(next, 0, moved);
  openIndex.value = next;
};

onMounted(async () => {
  await fetchAcademicUnits();
  await loadCategories();
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) return;
    const normalized = normalizeCourseRelatedData(newVal);
    if (JSON.stringify(normalized) === JSON.stringify(localData.value)) return;
    syncing = true;
    localData.value = normalized;
    syncing = false;
  },
  { deep: true },
);

watch(
  localData,
  (newVal) => {
    if (syncing) return;
    newVal.course_type = newVal.course_types.join(',');
    emit('update:modelValue', JSON.parse(JSON.stringify(newVal)));
  },
  { deep: true },
);
</script>

<style scoped>
.cr-hint {
  font-size: 11px;
  color: #6c757d;
  margin: 0;
}

.cr-type-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  font-size: 12px;
  font-weight: 500;
  color: #334155;
  background-color: #ffffff;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
}

.cr-type-pill.is-active {
  background-color: #e3173e;
  border-color: #e3173e;
  color: #ffffff;
}
</style>
