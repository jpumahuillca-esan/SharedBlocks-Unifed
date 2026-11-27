<template>
  <article class="course-catalog-card">
    <a
      :href="cardUrl"
      :target="cardTarget"
      class="course-catalog-card__media"
      :aria-label="item.title || 'Curso ESAN'"
    >
      <img
        v-if="resolvedImage"
        :src="resolvedImage"
        :alt="item.imageAlt || item.title || 'Curso ESAN'"
        :style="focusStyle"
        loading="lazy"
        decoding="async"
      />
      <div v-else class="course-catalog-card__media-fallback">
        <AtomIcon name="graduation-cap" :size="36" aria-hidden="true" />
        <span>{{ item.category_name || formatCourseType(item.course_type) }}</span>
      </div>

      <div v-if="dateBadge" class="course-catalog-card__date">
        <p class="course-catalog-card__date-day">{{ dateBadge.day }}</p>
        <p class="course-catalog-card__date-month">{{ dateBadge.month }}</p>
      </div>
    </a>

    <div class="course-catalog-card__body">
      <a
        :href="cardUrl"
        :target="cardTarget"
        class="course-catalog-card__title-link"
      >
        <h3 class="course-catalog-card__title">{{ item.title }}</h3>
      </a>

      <ul v-if="hasSpecs" class="course-catalog-card__specs">
        <li v-if="item.modality" class="course-catalog-card__spec">
          <span class="course-catalog-card__spec-icon" aria-hidden="true">
            <AtomIcon name="monitor" :size="18" />
          </span>
          <span class="course-catalog-card__spec-label">Modalidad:</span>
          <span class="course-catalog-card__spec-value">{{ item.modality }}</span>
        </li>

        <li v-if="classesLabel" class="course-catalog-card__spec">
          <span class="course-catalog-card__spec-icon" aria-hidden="true">
            <AtomIcon name="calendar" :size="18" />
          </span>
          <span class="course-catalog-card__spec-label">Clases:</span>
          <span class="course-catalog-card__spec-value">{{ classesLabel }}</span>
        </li>

        <li v-if="durationLabel" class="course-catalog-card__spec">
          <span class="course-catalog-card__spec-icon" aria-hidden="true">
            <AtomIcon name="clock" :size="18" />
          </span>
          <span class="course-catalog-card__spec-label">Duración:</span>
          <span class="course-catalog-card__spec-value">{{ durationLabel }}</span>
        </li>
      </ul>

      <div class="course-catalog-card__divider" aria-hidden="true"></div>

      <div class="course-catalog-card__actions">
        <AtomButton
          variant="primary"
          class="course-catalog-card__cta"
          :href="cardUrl"
          :target="cardTarget"
        >
          {{ primaryCtaLabel }}
        </AtomButton>

        <AtomButton
          variant="text"
          class="course-catalog-card__syllabus"
          :href="syllabusHref"
          :target="hasSyllabusFile ? '_blank' : cardTarget"
        >
          <AtomIcon name="file-text" :size="16" aria-hidden="true" />
          <span>{{ syllabusCtaLabel }}</span>
        </AtomButton>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
/**
 * Tarjeta reutilizable de Curso / Taller (Figma `card-courses-exl-idiomas`).
 * Compartida por CourseCatalogGrid y CourseRelated manteniendo diseño 1:1.
 */
import { computed } from 'vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import { imageFocusProfilesStyle, imageFocusStyle } from '../../../../helpers/imageFocus';
import { normalizeLinkTarget } from '../../../../helpers/linkTarget';
import {
  formatCourseDateBadge,
  formatCourseType,
  resolveClassesLabel,
  resolveCourseAssetUrl,
  resolveCourseSyllabusHref,
  resolveDurationLabel,
} from './courseCardUtils';

const props = withDefaults(
  defineProps<{
    item: Record<string, any>;
    primaryCtaLabel?: string;
    syllabusCtaLabel?: string;
  }>(),
  {
    primaryCtaLabel: 'Conoce más',
    syllabusCtaLabel: 'Ver temario',
  },
);

const cardUrl = computed(() => {
  const raw = props.item?.url || props.item?.href;
  return typeof raw === 'string' && raw.trim() ? raw.trim() : '#';
});

const cardTarget = computed(() => normalizeLinkTarget(props.item?.target) || undefined);

const resolvedImage = computed(() =>
  resolveCourseAssetUrl(props.item?.image_url || props.item?.image),
);

const focusStyle = computed(() => {
  if (props.item?.imageFocusProfiles) {
    return imageFocusProfilesStyle(
      props.item.imageFocusProfiles,
      props.item.imageFocusX,
      props.item.imageFocusY,
    );
  }
  return imageFocusStyle(props.item?.imageFocusX, props.item?.imageFocusY);
});

const dateBadge = computed(() => formatCourseDateBadge(props.item?.start_date));
const classesLabel = computed(() => resolveClassesLabel(props.item));
const durationLabel = computed(() => resolveDurationLabel(props.item));
const hasSpecs = computed(() => Boolean(props.item?.modality || classesLabel.value || durationLabel.value));
const hasSyllabusFile = computed(() => Boolean(props.item?.syllabus_path || props.item?.syllabusUrl));
const syllabusHref = computed(() => resolveCourseSyllabusHref(props.item));
</script>
