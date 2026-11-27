<template>
  <section class="course-faculty">
    <div class="course-faculty__inner">
      <header v-if="content.title" class="course-faculty__header">
        <AtomHeading
          :level="2"
          size="h1"
          weight="semibold"
          class="course-faculty__title"
          v-bind="edit('title')"
        >
          {{ content.title }}
        </AtomHeading>
        <span class="course-faculty__rule" aria-hidden="true"></span>
      </header>

      <ul v-if="visibleTeachers.length" class="course-faculty__list">
        <li
          v-for="teacher in visibleTeachers"
          :key="teacher.id"
          class="course-faculty__item"
          v-bind="edit(`teachers.${teacher.index}`)"
        >
          <article class="course-faculty__card">
            <div class="course-faculty__photo" v-bind="edit('.image')">
              <img
                v-if="teacher.resolvedImage"
                :src="teacher.resolvedImage"
                :alt="teacher.imageAlt || teacher.name || 'Docente ESAN'"
                :style="teacher.focusStyle"
                loading="lazy"
                decoding="async"
              />
              <div v-else class="course-faculty__photo-fallback" aria-hidden="true">
                <AtomIcon name="user" :size="36" />
              </div>
            </div>

            <div class="course-faculty__info">
              <AtomHeading
                v-if="teacher.name"
                :level="3"
                size="h6"
                weight="semibold"
                class="course-faculty__name"
                v-bind="edit('.name')"
              >
                <AtomLink
                  v-if="teacher.profileUrl"
                  as="a"
                  :href="teacher.profileUrl"
                  :target="teacher.profileTarget"
                  class="course-faculty__name-link"
                >
                  {{ teacher.name }}
                </AtomLink>
                <template v-else>{{ teacher.name }}</template>
              </AtomHeading>

              <p
                v-if="teacher.bio"
                class="course-faculty__bio"
                v-bind="edit('.bio')"
              >
                {{ teacher.bio }}
              </p>
            </div>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Plana Docente — Sección de docentes del curso (Figma `2664:49673` / `3552:13600` / `3543:39358`).
 * Tarjeta blanca con borde izquierdo rojo ESAN, retrato 100×100 redondeado (16px) y biografía.
 * Tolerante a columna lateral flotante (`ps-columns--float`).
 */
import { computed } from 'vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import AtomLink from '../../../atoms/AtomLink.vue';
import { imageFocusProfilesStyle } from '../../../../helpers/imageFocus';
import { formatImageUrl } from '../../../../helpers/url';
import { useEditTarget } from '../../../../core/editFocus';
import { normalizeCourseFacultyData } from './types';

const props = defineProps<{ data: any }>();
const edit = useEditTarget();

const content = computed(() => normalizeCourseFacultyData(props.data));

const visibleTeachers = computed(() =>
  content.value.teachers
    .map((teacher, index) => ({
      ...teacher,
      index,
      name: teacher.name.trim(),
      bio: teacher.bio.trim(),
      resolvedImage: teacher.image ? formatImageUrl(teacher.image) : '',
      focusStyle: imageFocusProfilesStyle(
        teacher.imageFocusProfiles,
        teacher.imageFocusX,
        teacher.imageFocusY,
      ),
    }))
    .filter((t) => t.name.length > 0 || t.bio.length > 0 || t.resolvedImage.length > 0),
);
</script>
