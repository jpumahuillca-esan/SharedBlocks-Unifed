<template>
  <section class="py-5 bg-light">
    <div class="container">
      <div class="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <h2 v-if="data.title" class="h3 fw-bold text-dark mb-1">{{ data.title }}</h2>
          <p v-if="data.subtitle" class="text-secondary mb-0">{{ data.subtitle }}</p>
        </div>

        <div class="d-flex flex-wrap gap-2">
          <input
            v-model="searchTerm"
            type="search"
            class="form-control form-control-sm"
            style="min-width: 220px;"
            placeholder="Buscar curso o programa..."
          />
          <select
            v-if="availableCategories.length > 0"
            v-model="selectedCategory"
            class="form-select form-select-sm"
            style="min-width: 200px;"
          >
            <option value="">Todas las áreas</option>
            <option v-for="cat in availableCategories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="filteredItems.length === 0" class="p-5 text-center border rounded-4 bg-light">
        <p class="text-muted mb-0">No se encontraron programas con los filtros seleccionados.</p>
      </div>

      <div v-else class="row g-4">
        <div v-for="item in filteredItems" :key="item.id || item.url" class="col-12 col-md-6 col-lg-4 d-flex">
          <div class="card border shadow-sm bg-light rounded-4 p-4 w-100 d-flex flex-column">
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
              <span v-if="item.category_name" class="badge bg-danger-subtle text-danger">
                {{ item.category_name }}
              </span>
              <span v-if="item.modality" class="small text-muted">
                <i class="las la-laptop me-1"></i>{{ item.modality }}
              </span>
            </div>

            <h3 class="h6 fw-bold text-dark mb-2">
              <a :href="item.url" class="text-dark text-decoration-none">{{ item.title }}</a>
            </h3>

            <p v-if="item.excerpt" class="small text-secondary mb-3 flex-grow-1">
              {{ item.excerpt }}
            </p>

            <div class="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
              <span class="small text-muted">{{ item.duration_label || '' }}</span>
              <a :href="item.url" class="btn btn-sm btn-outline-danger fw-bold">
                Ver detalle →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps<{
  data: {
    title?: string;
    subtitle?: string;
    academic_unit_id?: number | null;
    unit_slug?: string;
    course_type?: string;
    category_slug?: string;
    items?: any[];
  };
}>();

const searchTerm = ref('');
const selectedCategory = ref('');
const fetchedItems = ref<any[]>([]);
const hasFetchedFromApi = ref(false);

const sourceItems = computed(() => {
  if (hasFetchedFromApi.value) return fetchedItems.value;
  return Array.isArray(props.data?.items) ? props.data.items : [];
});

const availableCategories = computed(() => {
  const set = new Set<string>();
  for (const item of sourceItems.value) {
    if (item.category_name) set.add(item.category_name);
  }
  return Array.from(set);
});

const filteredItems = computed(() => {
  const q = searchTerm.value.trim().toLowerCase();
  return sourceItems.value.filter((item) => {
    const matchCat = !selectedCategory.value || item.category_name === selectedCategory.value;
    const matchSearch =
      !q ||
      String(item.title || '').toLowerCase().includes(q) ||
      String(item.category_name || '').toLowerCase().includes(q) ||
      String(item.excerpt || '').toLowerCase().includes(q);
    return matchCat && matchSearch;
  });
});

const fetchCatalog = async () => {
  try {
    const params = new URLSearchParams();
    params.set('per_page', '100');
    if (props.data?.academic_unit_id) params.set('academic_unit_id', String(props.data.academic_unit_id));
    if (props.data?.unit_slug) params.set('unit_slug', String(props.data.unit_slug));
    if (props.data?.course_type) params.set('course_type', String(props.data.course_type));
    if (props.data?.category_slug) params.set('category_slug', String(props.data.category_slug));

    const apiBase = (
      (typeof window !== 'undefined' && (window as any).__NUXT__?.config?.public?.apiBase) ||
      (import.meta as any)?.env?.VITE_PUBLIC_API_URL ||
      'http://127.0.0.1:4000/api/public'
    ).replace(/\/+$/, '');

    const res = await fetch(`${apiBase}/courses?${params.toString()}`).catch(() => null);
    if (res && res.ok) {
      const json = await res.json();
      if (Array.isArray(json?.data)) {
        fetchedItems.value = json.data;
        hasFetchedFromApi.value = true;
      }
    }
  } catch {}
};

onMounted(fetchCatalog);

watch(
  () => [
    props.data?.academic_unit_id,
    props.data?.unit_slug,
    props.data?.course_type,
    props.data?.category_slug,
  ],
  () => {
    selectedCategory.value = '';
    fetchCatalog();
  },
);
</script>
