<template>
  <section class="course-general-info">
    <div class="course-general-info__inner">
      <header v-if="content.title" class="course-general-info__header">
        <AtomHeading
          :level="2"
          size="h1"
          weight="semibold"
          class="course-general-info__title"
          v-bind="edit('title')"
        >
          {{ content.title }}
        </AtomHeading>
        <span class="course-general-info__rule" aria-hidden="true"></span>
      </header>

      <div class="course-general-info__body">
        <dl v-if="visibleRows.length" class="course-general-info__table">
          <div
            v-for="row in visibleRows"
            :key="row.id"
            class="course-general-info__row"
            v-bind="edit(`rows.${row.index}`)"
          >
            <dt class="course-general-info__label" v-bind="edit('.label')">
              {{ row.label }}
            </dt>
            <dd
              class="course-general-info__value"
              :class="row.isLongBody ? 'course-general-info__value--body' : 'course-general-info__value--display'"
              v-bind="edit('.value')"
            >
              {{ row.value }}
            </dd>
          </div>
        </dl>

        <div
          v-if="footnoteLines.length"
          class="course-general-info__footnotes"
          v-bind="edit('footnotes')"
        >
          <p v-for="(note, idx) in footnoteLines" :key="idx" class="course-general-info__footnote">
            {{ note }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Datos Generales — Tabla informativa del curso + notas legales al pie
 * (Figma `2664:49752` / `3552:13634` / `3543:38453`).
 * Tolerante a columna lateral flotante (`ps-columns--float`).
 */
import { computed } from 'vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import { useEditTarget } from '../../../../core/editFocus';
import { normalizeCourseGeneralInfoData } from './types';

const props = defineProps<{ data: any }>();
const edit = useEditTarget();

const content = computed(() => normalizeCourseGeneralInfoData(props.data));

const visibleRows = computed(() =>
  content.value.rows
    .map((row, index) => {
      const label = row.label.trim();
      const value = row.value.trim();
      const isLongBody =
        row.valueStyle === 'body' ||
        (row.valueStyle === 'auto' && value.length > 72);
      return {
        ...row,
        index,
        label,
        value,
        isLongBody,
      };
    })
    .filter((row) => row.label.length > 0 || row.value.length > 0),
);

const footnoteLines = computed(() =>
  content.value.footnotes
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean),
);
</script>
