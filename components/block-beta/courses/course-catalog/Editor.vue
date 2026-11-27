<template>
  <div class="course-catalog-editor">
    <h6 class="fw-bold small text-uppercase mb-2">Encabezado del catálogo</h6>

    <div class="form-check form-switch mb-2">
      <input
        id="cc-show-back"
        v-model="localData.showBackLink"
        type="checkbox"
        class="form-check-input"
      />
      <label for="cc-show-back" class="form-check-label small fw-semibold">
        Mostrar botón "Regresar"
      </label>
    </div>

    <div v-if="localData.showBackLink" class="ps-2 border-start border-2 mb-3">
      <EditorText
        v-model="localData.backLabel"
        data-edit-target="backLabel"
        class="mb-2"
        label="Texto de regreso"
        :maxlength="rules.backLabel.maxLength"
        placeholder="Regresar"
      />

      <EditorUrl
        v-model="localData.backUrl"
        v-model:target="localData.backTarget"
        label="URL de destino al regresar (opcional)"
        placeholder="/universidad/extended-learning/ o vacío para historial"
        :sections="availableSections"
      />
    </div>

    <EditorTextarea
      v-model="localData.title"
      data-edit-target="title"
      class="mb-2"
      label="Título principal"
      :rows="2"
      :maxlength="rules.title.maxLength"
      placeholder="Explora nuestros cursos y talleres"
    />

    <EditorTextarea
      v-model="localData.subtitle"
      data-edit-target="subtitle"
      class="mb-2"
      label="Subtítulo descriptivo (opcional)"
      :rows="2"
      :maxlength="rules.subtitle.maxLength"
      placeholder="Opcional: texto breve bajo la línea de acento"
    />

    <div class="mb-3">
      <label class="form-label small fw-bold d-block">Jerarquía semántica (SEO)</label>
      <div class="btn-group w-100" role="group" aria-label="Nivel de encabezado">
        <button
          type="button"
          class="btn btn-sm"
          :class="localData.headingLevel === 1 ? 'btn-secondary' : 'btn-outline-secondary'"
          @click="localData.headingLevel = 1"
        >
          H1 (Página índice)
        </button>
        <button
          type="button"
          class="btn btn-sm"
          :class="localData.headingLevel === 2 ? 'btn-secondary' : 'btn-outline-secondary'"
          @click="localData.headingLevel = 2"
        >
          H2 (Bloque en sección)
        </button>
      </div>
    </div>

    <hr />

    <div class="d-flex align-items-center justify-content-between mb-2">
      <h6 class="fw-bold small text-uppercase mb-0">
        Conexión Fastify (<code>/api/public/courses</code>)
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
        label="Slug o ruta de unidad (alternativo opcional)"
        placeholder="universidad/extended-learning"
      />
    </div>

    <div class="mb-3">
      <label class="form-label small fw-semibold d-block mb-1">
        Tipos de oferta a incluir
      </label>
      <div class="d-flex flex-wrap gap-2">
        <label
          v-for="opt in COURSE_TYPE_OPTIONS"
          :key="opt.value"
          class="cc-type-pill"
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
      <p class="cc-hint mt-1">
        Sin selección muestra todos los tipos. Marca "Cursos" + "Talleres" para ver ambos juntos.
      </p>
    </div>

    <div class="mb-3">
      <label class="form-label small fw-semibold mb-1">Categoría / Área preseleccionada (opcional)</label>
      <select
        v-if="categories.length > 0"
        v-model="localData.category_slug"
        class="form-select form-select-sm mb-2"
      >
        <option value="">Todas las áreas de interés</option>
        <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">
          {{ cat.name }} ({{ cat.courses_count ?? 0 }})
        </option>
      </select>

      <EditorText
        v-model="localData.category_slug"
        label="Slug de categoría inicial (opcional)"
        placeholder="data-analysis-y-estadistica"
      />
    </div>

    <div class="mb-3">
      <label class="form-label small fw-semibold" for="cc-per-page">
        Tarjetas por página ({{ localData.perPage }})
      </label>
      <input
        id="cc-per-page"
        v-model.number="localData.perPage"
        type="range"
        class="form-range"
        :min="rules.minPerPage"
        :max="rules.maxPerPage"
        step="2"
      />
    </div>

    <hr />

    <h6 class="fw-bold small text-uppercase mb-2">Filtros y textos de tarjeta</h6>

    <div class="d-grid gap-2 mb-3">
      <div class="form-check form-switch">
        <input id="cc-f-search" v-model="localData.showSearchFilter" type="checkbox" class="form-check-input" />
        <label for="cc-f-search" class="form-check-label small">Filtro "Buscar por nombre"</label>
      </div>
      <div class="form-check form-switch">
        <input id="cc-f-cat" v-model="localData.showCategoryFilter" type="checkbox" class="form-check-input" />
        <label for="cc-f-cat" class="form-check-label small">Filtro "Área de interés"</label>
      </div>
      <div class="form-check form-switch">
        <input id="cc-f-mod" v-model="localData.showModalityFilter" type="checkbox" class="form-check-input" />
        <label for="cc-f-mod" class="form-check-label small">Filtro "Modalidad"</label>
      </div>
      <div class="form-check form-switch">
        <input id="cc-f-start" v-model="localData.showStartDateFilter" type="checkbox" class="form-check-input" />
        <label for="cc-f-start" class="form-check-label small">Filtro "Inicio" (fechas)</label>
      </div>
    </div>

    <EditorText
      v-model="localData.primaryCtaLabel"
      class="mb-2"
      label="Botón principal de tarjeta"
      :maxlength="rules.primaryCtaLabel.maxLength"
      placeholder="Conoce más"
    />

    <EditorText
      v-model="localData.syllabusCtaLabel"
      label="Enlace secundario de tarjeta"
      :maxlength="rules.syllabusCtaLabel.maxLength"
      placeholder="Ver temario"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { PUBLIC_API_URL } from '../../../../config/apiConfig';
import { useBreadcrumb } from '../../../../composables/useBreadcrumb';
import {
  COURSE_CATALOG_RULES,
  COURSE_TYPE_OPTIONS,
  normalizeCourseCatalogData,
  type CourseCatalogData,
} from './types';

interface CourseCategoryOption {
  id: number;
  name: string;
  slug: string;
  courses_count?: number;
}

const props = defineProps<{
  modelValue?: Partial<CourseCatalogData>;
  pageAcademicUnitId?: number | null;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: CourseCatalogData): void;
}>();

const rules = COURSE_CATALOG_RULES;
const { academicUnits, fetchAcademicUnits } = useBreadcrumb();
const categories = ref<CourseCategoryOption[]>([]);
const loadingCategories = ref(false);
const localData = ref<CourseCatalogData>(normalizeCourseCatalogData(props.modelValue));

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
    // Mantiene ingreso manual si Fastify local no responde en el momento
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
  const unit = academicUnits.value.find((u) => Number(u.id) === Number(localData.value.academic_unit_id));
  localData.value.unit_slug = unit?.full_slug ? unit.full_slug.replace(/^\/+|\/+$/g, '') : unit?.slug || '';
  loadCategories();
};

const applyPageUnit = () => {
  if (!props.pageAcademicUnitId) return;
  localData.value.academic_unit_id = Number(props.pageAcademicUnitId);
  onUnitSelected();
};

onMounted(async () => {
  await fetchAcademicUnits();
  await loadCategories();
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) return;
    const normalized = normalizeCourseCatalogData(newVal);
    if (JSON.stringify(normalized) === JSON.stringify(localData.value)) return;
    localData.value = normalized;
  },
  { deep: true },
);

watch(
  localData,
  (newVal) => {
    newVal.course_type = newVal.course_types.join(',');
    emit('update:modelValue', JSON.parse(JSON.stringify(newVal)));
  },
  { deep: true },
);
</script>

<style scoped>
.cc-hint {
  font-size: 11px;
  color: #6c757d;
  margin: 0;
}

.cc-type-pill {
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

.cc-type-pill.is-active {
  background-color: #e3173e;
  border-color: #e3173e;
  color: #ffffff;
}
</style>
