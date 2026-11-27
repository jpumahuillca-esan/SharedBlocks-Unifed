<template>
  <section class="course-about">
    <div class="course-about__inner">
      <header v-if="content.title" class="course-about__header">
        <AtomHeading
          :level="2"
          size="h1"
          weight="semibold"
          class="course-about__title"
          v-bind="edit('title')"
        >
          {{ content.title }}
        </AtomHeading>
        <span class="course-about__rule" aria-hidden="true"></span>
      </header>

      <div class="course-about__body">
        <div
          v-if="paragraphs.length"
          class="course-about__description"
          v-bind="edit('description')"
        >
          <p v-for="(para, pIdx) in paragraphs" :key="pIdx" class="course-about__paragraph">
            <template v-for="(seg, sIdx) in para" :key="sIdx">
              <strong v-if="seg.bold">{{ seg.text }}</strong>
              <template v-else>{{ seg.text }}</template>
            </template>
          </p>
        </div>

        <div
          v-if="content.objectivesTitle || content.objectivesIntro || visibleObjectives.length"
          class="course-about__objectives"
        >
          <AtomHeading
            v-if="content.objectivesTitle"
            :level="3"
            size="h2"
            weight="semibold"
            class="course-about__objectives-title"
            v-bind="edit('objectivesTitle')"
          >
            {{ content.objectivesTitle }}
          </AtomHeading>

          <AtomText
            v-if="content.objectivesIntro"
            size="body"
            class="course-about__objectives-intro"
            v-bind="edit('objectivesIntro')"
          >
            {{ content.objectivesIntro }}
          </AtomText>

          <ul v-if="visibleObjectives.length" class="course-about__objectives-list">
            <li
              v-for="item in visibleObjectives"
              :key="item.id"
              class="course-about__objective-item"
              v-bind="edit(`objectives.${item.index}`)"
            >
              <span class="course-about__objective-bullet" aria-hidden="true"></span>
              <span class="course-about__objective-text" v-bind="edit('.text')">
                {{ item.text }}
              </span>
            </li>
          </ul>
        </div>

        <ul v-if="visibleHighlights.length" class="course-about__highlights">
          <li
            v-for="card in visibleHighlights"
            :key="card.id"
            class="course-about__highlight-card"
            v-bind="edit(`highlights.${card.index}`)"
          >
            <span class="course-about__highlight-icon" aria-hidden="true" v-bind="edit('.pictogram')">
              <AtomPictogram :name="card.pictogram" />
            </span>
            <p class="course-about__highlight-text" v-bind="edit('.text')">
              {{ card.text }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Acerca del curso — Sección detalle de curso (Figma `2664:48738` / `3552:13550` / `3543:38430`).
 * Combina descripción rica, objetivos con viñeta cuadrada roja y tarjetas con pictogramas de marca.
 * Tolerante a columna lateral flotante (`ps-columns--float`).
 */
import { computed } from 'vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomPictogram from '../../../atoms/AtomPictogram.vue';
import AtomText from '../../../atoms/AtomText.vue';
import { useEditTarget } from '../../../../core/editFocus';
import { normalizeCourseAboutData } from './types';

interface TextSegment {
  text: string;
  bold: boolean;
}

const props = defineProps<{ data: any }>();
const edit = useEditTarget();

const content = computed(() => normalizeCourseAboutData(props.data));

const parseInlineBold = (line: string): TextSegment[] => {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts
    .filter(Boolean)
    .map((part) =>
      part.startsWith('**') && part.endsWith('**') && part.length > 4
        ? { text: part.slice(2, -2), bold: true }
        : { text: part, bold: false },
    );
};

const paragraphs = computed<TextSegment[][]>(() => {
  const text = content.value.description.trim();
  if (!text) return [];
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(parseInlineBold);
});

const visibleObjectives = computed(() =>
  content.value.objectives
    .map((item, index) => ({ ...item, index, text: item.text.trim() }))
    .filter((item) => item.text.length > 0),
);

const visibleHighlights = computed(() =>
  content.value.highlights
    .map((card, index) => ({ ...card, index, text: card.text.trim() }))
    .filter((card) => card.text.length > 0),
);
</script>
