<template>
  <section class="course-related" :style="{ '--course-related-columns': String(content.columns) }">
    <div class="course-related__inner">
      <header v-if="content.title" class="course-related__header">
        <AtomHeading
          :level="2"
          size="h1"
          weight="semibold"
          class="course-related__title"
          v-bind="edit('title')"
        >
          {{ content.title }}
        </AtomHeading>
        <span class="course-related__rule" aria-hidden="true"></span>
      </header>

      <div class="course-related__slider">
        <CardSlider :count="displayedItems.length" :columns="content.columns">
          <CourseCard
            v-for="(item, index) in displayedItems"
            :key="item.id || item.url || index"
            v-bind="content.sourceMode === 'manual' ? edit(`items.${index}`) : {}"
            :item="item"
            :primary-cta-label="content.primaryCtaLabel"
            :syllabus-cta-label="content.syllabusCtaLabel"
          />
        </CardSlider>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Cursos Relacionados — Carrusel de tarjetas de cursos/talleres con DotsNav
 * (Figma `2664:49897` / `3552:14167` / `3543:38568`).
 * Soporta consulta dinámica en vivo a Fastify (/api/public/courses) excluyendo
 * la ruta actual, o curación manual desde el editor. Tolerante a sección flotante.
 */
import { computed, onMounted, ref, watch } from 'vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import CardSlider from '../../events/_shared/CardSlider.vue';
import CourseCard from '../_shared/CourseCard.vue';
import { resolveCourseApiBase } from '../_shared/courseCardUtils';
import { useEditTarget } from '../../../../core/editFocus';
import { normalizeCourseRelatedData } from './types';

const props = defineProps<{ data: any }>();
const edit = useEditTarget();

const content = computed(() => normalizeCourseRelatedData(props.data));

const apiItems = ref<any[]>([]);
const hasFetchedFromApi = ref(false);
let fetchSeq = 0;

const normalizePath = (p?: string | null): string =>
  typeof p === 'string' ? p.replace(/\/+$/, '').toLowerCase() : '';

const displayedItems = computed(() => {
  if (content.value.sourceMode === 'api' && hasFetchedFromApi.value && apiItems.value.length > 0) {
    return apiItems.value;
  }
  return content.value.items.filter((item) => item.title.trim().length > 0);
});

const fetchRelated = async () => {
  if (content.value.sourceMode !== 'api') {
    hasFetchedFromApi.value = false;
    return;
  }

  const seq = ++fetchSeq;
  try {
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('per_page', String(content.value.limit + 2));

    if (content.value.academic_unit_id) {
      params.set('academic_unit_id', String(content.value.academic_unit_id));
    } else if (content.value.unit_slug) {
      params.set('unit_slug', content.value.unit_slug);
    }

    if (content.value.course_types.length > 0) {
      params.set('course_types', content.value.course_types.join(','));
    }

    if (content.value.category_slug) {
      params.set('category_slugs', content.value.category_slug);
    }

    const res = await fetch(`${resolveCourseApiBase()}/courses?${params.toString()}`).catch(() => null);
    if (seq !== fetchSeq) return;

    if (res && res.ok) {
      const json = await res.json();
      if (seq !== fetchSeq) return;
      if (Array.isArray(json?.data)) {
        const currentPath =
          typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '';
        apiItems.value = json.data
          .filter((item: any) => !currentPath || normalizePath(item?.url) !== currentPath)
          .slice(0, content.value.limit);
        hasFetchedFromApi.value = true;
      }
    }
  } catch {
    // Mantiene respaldo seguro si Fastify no está accesible en previsualización aislada
  }
};

onMounted(fetchRelated);

watch(
  () => [
    content.value.sourceMode,
    content.value.limit,
    content.value.academic_unit_id,
    content.value.unit_slug,
    content.value.course_types.join(','),
    content.value.category_slug,
  ],
  fetchRelated,
);
</script>
