<template>
  <div class="course-catalog-editor p-1">
    <!-- Encabezado del bloque -->
    <div class="border rounded p-3 mb-3 bg-white">
      <h6 class="small fw-bold text-uppercase text-muted mb-2">
        <i class="las la-heading text-danger me-1"></i> Encabezado de la Grilla
      </h6>

      <div class="mb-2">
        <label class="form-label x-small fw-semibold text-muted mb-1">Título principal</label>
        <input
          v-model="localData.title"
          type="text"
          class="form-control form-control-sm"
          placeholder="Ej: Catálogo de Programas y Cursos"
        />
      </div>

      <div>
        <label class="form-label x-small fw-semibold text-muted mb-1">Subtítulo descriptivo</label>
        <textarea
          v-model="localData.subtitle"
          rows="2"
          class="form-control form-control-sm"
          placeholder="Ej: Filtra por área temática o buscador en tiempo real"
        ></textarea>
      </div>
    </div>

    <!-- Filtros dinámicos de API pública -->
    <div class="border rounded p-3 bg-white">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <h6 class="small fw-bold text-uppercase text-muted mb-0">
          <i class="las la-filter text-danger me-1"></i> Origen Dinámico (Cursos / Idiomas)
        </h6>
        <span v-if="loadingCategories" class="spinner-border spinner-border-sm text-danger" role="status"></span>
      </div>

      <!-- Unidad Académica -->
      <div class="mb-3">
        <div class="d-flex align-items-center justify-content-between mb-1">
          <label class="form-label x-small fw-semibold text-muted mb-0">Unidad Académica</label>
          <button
            v-if="pageAcademicUnitId && localData.academic_unit_id !== pageAcademicUnitId"
            type="button"
            class="btn btn-xs btn-link p-0 text-decoration-none"
            style="font-size: 11px;"
            @click="applyPageUnit"
          >
            Usar unidad de la página
          </button>
        </div>

        <select
          v-model="localData.academic_unit_id"
          class="form-select form-select-sm"
          @change="onUnitSelected"
        >
          <option :value="null">Todas las unidades académicas</option>
          <option
            v-for="unit in academicUnits"
            :key="unit.id"
            :value="unit.id"
          >
            {{ unit.name }} {{ unit.slug ? `(/${unit.slug})` : '' }}
          </option>
        </select>

        <div class="mt-2">
          <label class="form-label x-small fw-semibold text-muted mb-1">
            Slug de unidad (opcional si se filtra por URL)
          </label>
          <input
            v-model="localData.unit_slug"
            type="text"
            class="form-control form-control-sm font-monospace"
            placeholder="ej. idiomas, posgrado"
          />
        </div>
      </div>

      <!-- Tipo de Curso -->
      <div class="mb-3">
        <label class="form-label x-small fw-semibold text-muted mb-1">Tipo de Oferta</label>
        <select
          v-model="localData.course_type"
          class="form-select form-select-sm"
          @change="loadCategories"
        >
          <option value="">Todos los tipos</option>
          <option
            v-for="opt in COURSE_TYPE_OPTIONS"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>

      <!-- Categoría -->
      <div>
        <label class="form-label x-small fw-semibold text-muted mb-1">Categoría / Área</label>
        <select
          v-if="categories.length > 0"
          v-model="localData.category_slug"
          class="form-select form-select-sm mb-2"
        >
          <option value="">Todas las categorías</option>
          <option
            v-for="cat in categories"
            :key="cat.slug"
            :value="cat.slug"
          >
            {{ cat.name }} ({{ cat.courses_count ?? 0 }})
          </option>
        </select>

        <input
          v-model="localData.category_slug"
          type="text"
          class="form-control form-control-sm font-monospace"
          placeholder="Slug de categoría (opcional, ej. finanzas)"
        />
        <small class="text-muted d-block mt-1" style="font-size: 11px;">
          El bloque consulta los cursos publicados en tiempo real y permite buscar/filtrar en el sitio público.
        </small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { PUBLIC_API_URL } from '../../../../config/apiConfig';
import { useBreadcrumb } from '../../../../composables/useBreadcrumb';

interface CourseCatalogData {
  title: string;
  subtitle: string;
  academic_unit_id: number | null;
  unit_slug: string;
  course_type: string;
  category_slug: string;
  items: any[];
}

interface CourseCategoryOption {
  id: number;
  name: string;
  slug: string;
  courses_count?: number;
}

const COURSE_TYPE_OPTIONS = [
  { value: 'curso', label: 'Cursos' },
  { value: 'taller', label: 'Talleres' },
  { value: 'certificacion', label: 'Certificaciones' },
  { value: 'idioma', label: 'Idiomas' },
  { value: 'titulacion', label: 'Titulación' },
];

const props = defineProps<{
  modelValue?: Partial<CourseCatalogData>;
  pageAcademicUnitId?: number | null;
  availableSections?: Array<{ id: string; title: string }>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: CourseCatalogData): void;
}>();

const { academicUnits, fetchAcademicUnits } = useBreadcrumb();
const categories = ref<CourseCategoryOption[]>([]);
const loadingCategories = ref(false);

const build = (source?: Partial<CourseCatalogData>): CourseCatalogData => ({
  title: source?.title ?? 'Catálogo de Programas y Cursos',
  subtitle: source?.subtitle ?? 'Filtra por área temática o buscador en tiempo real',
  academic_unit_id: source?.academic_unit_id ? Number(source.academic_unit_id) : null,
  unit_slug: source?.unit_slug ?? '',
  course_type: source?.course_type ?? '',
  category_slug: source?.category_slug ?? '',
  items: Array.isArray(source?.items) ? [...source.items] : [],
});

const localData = ref<CourseCatalogData>(build(props.modelValue));

const loadCategories = async () => {
  loadingCategories.value = true;
  try {
    const params = new URLSearchParams();
    if (localData.value.academic_unit_id) {
      params.set('academic_unit_id', String(localData.value.academic_unit_id));
    } else if (localData.value.unit_slug) {
      params.set('unit_slug', localData.value.unit_slug);
    }
    if (localData.value.course_type) {
      params.set('course_type', localData.value.course_type);
    }

    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${PUBLIC_API_URL}/courses/categories${qs}`);
    if (res.ok) {
      const json = await res.json();
      categories.value = Array.isArray(json?.data) ? json.data : [];
    }
  } catch {
    // Mantiene ingreso manual de category_slug si la API pública no responde
  } finally {
    loadingCategories.value = false;
  }
};

const onUnitSelected = () => {
  const unit = academicUnits.value.find((u) => Number(u.id) === Number(localData.value.academic_unit_id));
  localData.value.unit_slug = unit?.slug || '';
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
.x-small {
  font-size: 11px;
}
</style>
