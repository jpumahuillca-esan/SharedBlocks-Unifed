<template>
  <section
    ref="sectionRef"
    class="course-catalog"
    :class="[`course-catalog--${content.layoutMode}`]"
    :style="sectionStyle"
    v-bind="edit('backgroundToken')"
  >
    <div class="course-catalog__inner">
      <header class="course-catalog__header">
        <AtomButton
          v-if="isSidebarLayout && content.showBackLink && (content.backUrl || content.backLabel)"
          variant="text"
          class="course-catalog__back"
          :href="content.backUrl || undefined"
          :target="content.backUrl ? content.backTarget : undefined"
          v-bind="edit('backLabel')"
          @click="onBackClick"
        >
          <AtomIcon name="arrow-left" :size="18" aria-hidden="true" />
          {{ content.backLabel || 'Regresar' }}
        </AtomButton>

        <AtomEyebrow
          v-if="content.eyebrow"
          as="p"
          variant="brand"
          class="course-catalog__eyebrow"
          v-bind="edit('eyebrow')"
        >
          {{ content.eyebrow }}
        </AtomEyebrow>

        <AtomHeading
          v-if="content.title"
          :as="content.headingLevel === 1 ? 'h1' : 'h2'"
          :level="content.headingLevel"
          size="h2"
          weight="semibold"
          class="course-catalog__title"
          v-bind="edit('title')"
        >
          {{ content.title }}
        </AtomHeading>

        <span v-if="content.title" class="course-catalog__rule" aria-hidden="true"></span>

        <p
          v-if="content.subtitle"
          class="course-catalog__subtitle"
          v-bind="edit('subtitle')"
        >
          {{ content.subtitle }}
        </p>

        <div v-if="isSidebarLayout && hasAnyFilterPanel" class="course-catalog__mobile-bar">
          <button
            type="button"
            class="btn btn--text course-catalog__drawer-trigger"
            :aria-expanded="drawerOpen"
            aria-controls="course-catalog-filters"
            @click="openDrawer"
          >
            <AtomIcon name="sliders-horizontal" :size="20" aria-hidden="true" />
            <span>Búsqueda avanzada</span>
            <span v-if="activeFiltersCount > 0" class="course-catalog__active-count">
              {{ activeFiltersCount }}
            </span>
          </button>

          <button
            v-if="activeFiltersCount > 0"
            type="button"
            class="course-catalog__clear-link"
            @click="clearAllFilters"
          >
            Limpiar filtros
          </button>
        </div>
      </header>

      <!-- Barra de búsqueda superior a 100% (variante Talleres / sin sidebar) -->
      <div
        v-if="!isSidebarLayout && content.showSearchFilter"
        class="course-catalog__top-search"
        v-bind="edit('searchPlaceholder')"
      >
        <div class="form-field form-field--icon-start">
          <span class="form-field__icon" aria-hidden="true">
            <AtomIcon name="search" :size="18" />
          </span>
          <AtomFormInput
            v-model="searchTerm"
            type="search"
            :placeholder="content.searchPlaceholder"
            :aria-label="content.searchPlaceholder || 'Buscar curso por nombre'"
          />
        </div>
      </div>

      <div class="course-catalog__body">
        <div
          v-if="isSidebarLayout && drawerOpen"
          class="course-catalog__backdrop"
          aria-hidden="true"
          @click="closeDrawer"
        ></div>

        <aside
          v-if="isSidebarLayout && hasAnyFilterPanel"
          id="course-catalog-filters"
          class="course-catalog__sidebar"
          :class="{ 'is-open': drawerOpen }"
          aria-label="Filtros del catálogo"
        >
          <div class="course-catalog__drawer-head">
            <button
              type="button"
              class="course-catalog__drawer-close"
              aria-label="Cerrar filtros"
              @click="closeDrawer"
            >
              <AtomIcon name="x" :size="24" aria-hidden="true" />
            </button>
          </div>

          <!-- 1. Buscar -->
          <div v-if="content.showSearchFilter" class="course-catalog__widget">
            <button
              type="button"
              class="course-catalog__widget-toggle"
              :aria-expanded="sectionsOpen.search"
              @click="sectionsOpen.search = !sectionsOpen.search"
            >
              <span>Buscar</span>
              <AtomIcon :name="sectionsOpen.search ? 'chevron-up' : 'chevron-down'" :size="18" aria-hidden="true" />
            </button>

            <div v-show="sectionsOpen.search" class="course-catalog__widget-body">
              <div class="form-field form-field--icon-start">
                <span class="form-field__icon" aria-hidden="true">
                  <AtomIcon name="search" :size="18" />
                </span>
                <AtomFormInput
                  v-model="searchTerm"
                  type="search"
                  placeholder="Buscar por nombre"
                  aria-label="Buscar curso o programa por nombre"
                />
              </div>
            </div>
          </div>

          <!-- 2. Área de interés -->
          <div
            v-if="content.showCategoryFilter && categoryOptions.length > 0"
            class="course-catalog__widget"
          >
            <button
              type="button"
              class="course-catalog__widget-toggle"
              :aria-expanded="sectionsOpen.category"
              @click="sectionsOpen.category = !sectionsOpen.category"
            >
              <span>Área de interés</span>
              <AtomIcon :name="sectionsOpen.category ? 'chevron-up' : 'chevron-down'" :size="18" aria-hidden="true" />
            </button>

            <div v-show="sectionsOpen.category" class="course-catalog__checklist">
              <AtomFormCheck
                v-for="cat in categoryOptions"
                :key="cat.slug"
                type="checkbox"
                :model-value="selectedCategories.includes(cat.slug)"
                @update:model-value="toggleCategory(cat.slug, Boolean($event))"
              >
                <span class="course-catalog__check-label">
                  <span>{{ cat.name }}</span>
                  <span v-if="cat.count > 0" class="course-catalog__check-count">({{ cat.count }})</span>
                </span>
              </AtomFormCheck>
            </div>
          </div>

          <!-- 3. Modalidad -->
          <div
            v-if="content.showModalityFilter && modalityOptions.length > 0"
            class="course-catalog__widget"
          >
            <button
              type="button"
              class="course-catalog__widget-toggle"
              :aria-expanded="sectionsOpen.modality"
              @click="sectionsOpen.modality = !sectionsOpen.modality"
            >
              <span>Modalidad</span>
              <AtomIcon :name="sectionsOpen.modality ? 'chevron-up' : 'chevron-down'" :size="18" aria-hidden="true" />
            </button>

            <div v-show="sectionsOpen.modality" class="course-catalog__chips">
              <MoleculeChip
                :active="selectedModality === ''"
                @click="selectModality('')"
              >
                Todas
              </MoleculeChip>

              <MoleculeChip
                v-for="mod in modalityOptions"
                :key="mod.value"
                :active="selectedModality === mod.value"
                @click="selectModality(mod.value)"
              >
                {{ mod.label }}
                <span class="chip__count">{{ mod.count }}</span>
              </MoleculeChip>
            </div>
          </div>

          <!-- 4. Inicio -->
          <div v-if="content.showStartDateFilter" class="course-catalog__widget">
            <button
              type="button"
              class="course-catalog__widget-toggle"
              :aria-expanded="sectionsOpen.startDate"
              @click="sectionsOpen.startDate = !sectionsOpen.startDate"
            >
              <span>Inicio</span>
              <AtomIcon :name="sectionsOpen.startDate ? 'chevron-up' : 'chevron-down'" :size="18" aria-hidden="true" />
            </button>

            <div v-show="sectionsOpen.startDate" class="course-catalog__chips course-catalog__chips--column">
              <MoleculeChip
                v-for="opt in startDateOptions"
                :key="opt.value || 'all'"
                :active="selectedStartFilter === opt.value"
                @click="selectStartFilter(opt.value)"
              >
                {{ opt.label }}
                <span v-if="opt.count !== null" class="chip__count">{{ opt.count }}</span>
              </MoleculeChip>
            </div>
          </div>
        </aside>

        <div class="course-catalog__main">
          <div v-if="activeFiltersCount > 0 || totalCount > 0" class="course-catalog__toolbar">
            <p class="course-catalog__status-text">
              <template v-if="isLoading">Actualizando catálogo…</template>
              <template v-else>
                Mostrando {{ displayedItems.length }} de {{ totalCount }} programa{{ totalCount === 1 ? '' : 's' }}
              </template>
            </p>

            <button
              v-if="activeFiltersCount > 0"
              type="button"
              class="course-catalog__clear-link course-catalog__clear-link--desktop"
              @click="clearAllFilters"
            >
              Limpiar filtros
            </button>
          </div>

          <div v-if="isLoading && displayedItems.length === 0" :class="['course-catalog__loading-grid', 'course-catalog__grid', gridColumnsClass]">
            <div v-for="idx in skeletonCount" :key="idx" class="course-catalog__skeleton" aria-hidden="true"></div>
          </div>

          <div v-else-if="displayedItems.length === 0" class="course-catalog__empty">
            <p>No se encontraron cursos o programas con los filtros seleccionados.</p>
            <button
              v-if="activeFiltersCount > 0"
              type="button"
              class="btn btn--secondary btn--sm"
              @click="clearAllFilters"
            >
              Restablecer filtros
            </button>
          </div>

          <div v-else :class="['course-catalog__grid', gridColumnsClass]">
            <CourseCard
              v-for="item in displayedItems"
              :key="item.id || item.url"
              :item="item"
              :primary-cta-label="content.primaryCtaLabel"
              :syllabus-cta-label="content.syllabusCtaLabel"
            />
          </div>

          <div v-if="totalPages > 1" class="course-catalog__pagination">
            <MoleculePagination
              :current-page="currentPage"
              :total-pages="totalPages"
              @change="onPageChange"
            />
          </div>
        </div>
      </div>

      <!-- Alerta informativa inferior opcional (ej. Talleres para Adolescentes: cupos limitados) -->
      <div
        v-if="content.showBottomAlert && (content.bottomAlertTitle || content.bottomAlertText)"
        class="course-catalog__alert"
        v-bind="edit('bottomAlertText')"
      >
        <MoleculeAlert
          :variant="content.bottomAlertVariant"
          :title="content.bottomAlertTitle"
          :text="content.bottomAlertText"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Catálogo Dinámico de Cursos, Talleres y Programas conectado a Fastify (/api/public/courses).
 * Soporta paginación de servidor, facetas en vivo (Área de interés, Modalidad, Inicio)
 * y cajón lateral responsivo de filtros en tableta y móvil.
 */
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch, type CSSProperties } from 'vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomEyebrow from '../../../atoms/AtomEyebrow.vue';
import AtomFormCheck from '../../../atoms/AtomFormCheck.vue';
import AtomFormInput from '../../../atoms/AtomFormInput.vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import MoleculeAlert from '../../../molecules/MoleculeAlert.vue';
import MoleculeChip from '../../../molecules/MoleculeChip.vue';
import MoleculePagination from '../../../molecules/MoleculePagination.vue';
import CourseCard from '../_shared/CourseCard.vue';
import { resolveCourseApiBase } from '../_shared/courseCardUtils';
import { useEditTarget } from '../../../../core/editFocus';
import {
  normalizeCourseCatalogData,
  type CourseCategoryFacet,
  type CourseModalityFacet,
  type CourseStartDateFacets,
  type CourseStartFilterValue,
} from './types';

const props = defineProps<{ data: any }>();
const edit = useEditTarget();
const content = computed(() => normalizeCourseCatalogData(props.data));
const sectionRef = ref<HTMLElement | null>(null);

const isSidebarLayout = computed(() => content.value.layoutMode === 'sidebar-grid');
const gridColumnsClass = computed(() =>
  content.value.columns === 3 ? 'course-catalog__grid--cols-3' : null,
);
const skeletonCount = computed(() => (content.value.columns === 3 ? 6 : 4));

const sectionStyle = computed<CSSProperties>(() =>
  content.value.backgroundToken
    ? { backgroundColor: `var(${content.value.backgroundToken})` }
    : {},
);

const searchTerm = ref('');
const selectedCategories = ref<string[]>(
  content.value.category_slug ? [content.value.category_slug] : [],
);
const selectedModality = ref('');
const selectedStartFilter = ref<CourseStartFilterValue>('');
const currentPage = ref(1);

const drawerOpen = ref(false);
const sectionsOpen = reactive({
  search: true,
  category: true,
  modality: true,
  startDate: true,
});

const fetchedItems = ref<any[]>([]);
const fetchedMeta = ref<{ total: number; per_page: number; current_page: number; last_page: number } | null>(null);
const fetchedFacets = ref<{
  categories: CourseCategoryFacet[];
  modalities: CourseModalityFacet[];
  start_dates: CourseStartDateFacets;
} | null>(null);
const hasFetchedFromApi = ref(false);
const isLoading = ref(false);

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let fetchSequence = 0;
let suppressSearchWatch = false;

const VALID_START_FILTERS = new Set<string>(['this_month', 'next_month', 'tbd']);
const URL_FILTER_KEYS = ['categoria', 'category', 'category_slug', 'category_slugs', 'modalidad', 'modality', 'inicio', 'start_filter', 'q', 'search', 'buscar'];

/** Lee filtros iniciales desde la URL (ej. `?categoria=data-analysis-y-estadistica`). */
const applyUrlFilters = (): boolean => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  let applied = false;

  const rawCategories =
    params.get('categoria') ||
    params.get('category') ||
    params.get('category_slug') ||
    params.get('category_slugs') ||
    '';

  if (rawCategories.trim()) {
    const parsed = Array.from(
      new Set(
        rawCategories
          .split(',')
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean),
      ),
    );
    if (parsed.length > 0) {
      selectedCategories.value = parsed;
      applied = true;
    }
  } else {
    selectedCategories.value = content.value.category_slug ? [content.value.category_slug] : [];
  }

  const rawModality = (params.get('modalidad') || params.get('modality') || '').trim();
  if (rawModality) {
    selectedModality.value = rawModality;
    applied = true;
  } else {
    selectedModality.value = '';
  }

  const rawStart = (params.get('inicio') || params.get('start_filter') || '').trim().toLowerCase();
  if (VALID_START_FILTERS.has(rawStart)) {
    selectedStartFilter.value = rawStart as CourseStartFilterValue;
    applied = true;
  } else {
    selectedStartFilter.value = '';
  }

  const rawSearch = (params.get('q') || params.get('search') || params.get('buscar') || '').trim();
  if (rawSearch) {
    suppressSearchWatch = true;
    searchTerm.value = rawSearch;
    applied = true;
  }

  if (applied) {
    currentPage.value = 1;
  }
  return applied;
};

const clearUrlFilterParams = () => {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  let changed = false;
  for (const key of URL_FILTER_KEYS) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  if (changed) {
    const clean = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState(window.history.state, '', clean);
  }
};

const hasAnyFilterPanel = computed(() =>
  content.value.showSearchFilter ||
  content.value.showCategoryFilter ||
  content.value.showModalityFilter ||
  content.value.showStartDateFilter,
);

const activeFiltersCount = computed(() => {
  let count = 0;
  if (searchTerm.value.trim()) count += 1;
  count += selectedCategories.value.length;
  if (selectedModality.value) count += 1;
  if (selectedStartFilter.value) count += 1;
  return count;
});

const displayedItems = computed(() => {
  if (hasFetchedFromApi.value) return fetchedItems.value;
  return content.value.items;
});

const totalCount = computed(() => {
  if (hasFetchedFromApi.value && fetchedMeta.value) return fetchedMeta.value.total;
  return displayedItems.value.length;
});

const totalPages = computed(() => {
  if (hasFetchedFromApi.value && fetchedMeta.value) return fetchedMeta.value.last_page;
  return Math.max(1, Math.ceil(displayedItems.value.length / content.value.perPage));
});

const categoryOptions = computed<CourseCategoryFacet[]>(() => {
  if (fetchedFacets.value?.categories) return fetchedFacets.value.categories;
  const map = new Map<string, CourseCategoryFacet>();
  for (const item of content.value.items) {
    if (item?.category_slug && item?.category_name) {
      const existing = map.get(item.category_slug);
      if (existing) existing.count += 1;
      else map.set(item.category_slug, { id: Number(item.category_id || 0), name: item.category_name, slug: item.category_slug, count: 1 });
    }
  }
  return Array.from(map.values());
});

const modalityOptions = computed<CourseModalityFacet[]>(() => {
  if (fetchedFacets.value?.modalities) return fetchedFacets.value.modalities;
  const map = new Map<string, number>();
  for (const item of content.value.items) {
    const mod = typeof item?.modality === 'string' ? item.modality.trim() : '';
    if (mod) map.set(mod, (map.get(mod) || 0) + 1);
  }
  return Array.from(map.entries()).map(([value, count]) => ({ value, label: value, count }));
});

const startDateOptions = computed<Array<{ value: CourseStartFilterValue; label: string; count: number | null }>>(() => {
  const facets = fetchedFacets.value?.start_dates;
  return [
    { value: '', label: 'Cualquier fecha', count: null },
    { value: 'this_month', label: 'Este mes', count: facets ? facets.this_month : null },
    { value: 'next_month', label: 'Próximo mes', count: facets ? facets.next_month : null },
    { value: 'tbd', label: 'Por confirmar', count: facets ? facets.tbd : null },
  ];
});

const fetchCatalog = async () => {
  const seq = ++fetchSequence;
  isLoading.value = true;

  try {
    const params = new URLSearchParams();
    params.set('page', String(currentPage.value));
    params.set('per_page', String(content.value.perPage));

    if (content.value.academic_unit_id) {
      params.set('academic_unit_id', String(content.value.academic_unit_id));
    } else if (content.value.unit_slug) {
      params.set('unit_slug', content.value.unit_slug);
    }

    if (content.value.course_types.length > 0) {
      params.set('course_types', content.value.course_types.join(','));
    }

    if (selectedCategories.value.length > 0) {
      params.set('category_slugs', selectedCategories.value.join(','));
    }

    if (selectedModality.value) {
      params.set('modality', selectedModality.value);
    }

    if (selectedStartFilter.value) {
      params.set('start_filter', selectedStartFilter.value);
    }

    if (searchTerm.value.trim()) {
      params.set('search', searchTerm.value.trim());
    }

    const res = await fetch(`${resolveCourseApiBase()}/courses?${params.toString()}`).catch(() => null);
    if (seq !== fetchSequence) return;

    if (res && res.ok) {
      const json = await res.json();
      if (seq !== fetchSequence) return;
      if (Array.isArray(json?.data)) {
        fetchedItems.value = json.data;
        fetchedMeta.value = json.meta || null;
        if (json.facets) {
          fetchedFacets.value = json.facets;
        }
        hasFetchedFromApi.value = true;
      }
    }
  } catch {
    // Mantiene último estado seguro si el API local aún no responde
  } finally {
    if (seq === fetchSequence) {
      isLoading.value = false;
    }
  }
};

const toggleCategory = (slug: string, checked: boolean) => {
  const next = new Set(selectedCategories.value);
  if (checked) next.add(slug);
  else next.delete(slug);
  selectedCategories.value = Array.from(next);
  currentPage.value = 1;
  fetchCatalog();
};

const selectModality = (modality: string) => {
  selectedModality.value = modality;
  currentPage.value = 1;
  fetchCatalog();
};

const selectStartFilter = (val: CourseStartFilterValue) => {
  selectedStartFilter.value = val;
  currentPage.value = 1;
  fetchCatalog();
};

const clearAllFilters = () => {
  searchTerm.value = '';
  selectedCategories.value = [];
  selectedModality.value = '';
  selectedStartFilter.value = '';
  currentPage.value = 1;
  clearUrlFilterParams();
  fetchCatalog();
};

const onPageChange = (page: number) => {
  currentPage.value = page;
  fetchCatalog();
  if (typeof window !== 'undefined' && sectionRef.value) {
    sectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const onBackClick = (event: Event) => {
  if (content.value.backUrl) return;
  event.preventDefault();
  if (typeof window !== 'undefined' && window.history.length > 1) {
    window.history.back();
  }
};

const openDrawer = () => {
  drawerOpen.value = true;
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }
};

const closeDrawer = () => {
  drawerOpen.value = false;
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
};

const onDocumentKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && drawerOpen.value) {
    closeDrawer();
  }
};

const onPopstate = () => {
  applyUrlFilters();
  fetchCatalog();
};

onMounted(() => {
  document.addEventListener('keydown', onDocumentKeydown);
  window.addEventListener('popstate', onPopstate);
  applyUrlFilters();
  fetchCatalog();
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onDocumentKeydown);
  window.removeEventListener('popstate', onPopstate);
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
});

watch(searchTerm, () => {
  if (suppressSearchWatch) {
    suppressSearchWatch = false;
    return;
  }
  if (!hasFetchedFromApi.value && !searchTerm.value.trim()) return;
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    currentPage.value = 1;
    fetchCatalog();
  }, 300);
});

watch(
  () => [
    content.value.academic_unit_id,
    content.value.unit_slug,
    content.value.course_types.join(','),
    content.value.category_slug,
    content.value.perPage,
  ],
  () => {
    selectedCategories.value = content.value.category_slug ? [content.value.category_slug] : [];
    selectedModality.value = '';
    selectedStartFilter.value = '';
    currentPage.value = 1;
    fetchCatalog();
  },
);
</script>
