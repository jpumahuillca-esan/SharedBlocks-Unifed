<template>
  <section class="study-modalities">
    <div
      class="study-modalities__container"
      :style="containerStyle"
      v-bind="edit('panelColorToken')"
    >
      <!-- Optional subtle background image texture inside the rounded box -->
      <span
        v-if="dataNormalized.backgroundImage"
        class="study-modalities__bg-texture"
        :style="{
          backgroundImage: `url(${dataNormalized.backgroundImage})`,
          opacity: dataNormalized.backgroundOverlayOpacity / 100,
        }"
        aria-hidden="true"
      ></span>

      <div class="study-modalities__content">
        <AtomHeading
          v-if="dataNormalized.title"
          :level="2"
          size="h3"
          weight="semibold"
          class="study-modalities__title"
          v-bind="edit('title')"
        >
          {{ dataNormalized.title }}
        </AtomHeading>

        <ul
          v-if="visibleBadges.length"
          class="study-modalities__badges"
          aria-label="Modalidades disponibles"
        >
          <li
            v-for="badge in visibleBadges"
            :key="badge.id"
            class="study-modalities__badge"
            v-bind="edit(`badges.${badge.index}.label`)"
          >
            <span class="study-modalities__badge-text">{{ badge.label }}</span>
          </li>
        </ul>

        <AtomText
          v-if="dataNormalized.subtitle"
          size="body-lg"
          class="study-modalities__subtitle"
          v-bind="edit('subtitle')"
        >
          {{ dataNormalized.subtitle }}
        </AtomText>
      </div>

      <div
        class="study-modalities__media"
        v-bind="edit('image')"
      >
        <img
          class="study-modalities__img"
          :src="resolvedPersonImage"
          :alt="dataNormalized.imageAlt || dataNormalized.title || ''"
          width="447"
          height="314"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import defaultPersonUrl from '../../../../assets/images/dpa-modalities-person.png';
import { useEditTarget } from '../../../../core/editFocus';
import { normalizeStudyModalitiesData } from './types';

const edit = useEditTarget();

const props = defineProps<{
  data: any;
}>();

const dataNormalized = computed(() => normalizeStudyModalitiesData(props.data));

const visibleBadges = computed(() =>
  dataNormalized.value.badges
    .map((b, index) => ({ ...b, index }))
    .filter((b) => b.label.trim().length > 0),
);

const resolvedPersonImage = computed(
  () => dataNormalized.value.image?.trim() || defaultPersonUrl,
);

const containerStyle = computed<CSSProperties>(() => ({
  '--study-modalities-bg': `var(${dataNormalized.value.panelColorToken || '--ds-color-univ-dpa'})`,
} as CSSProperties));
</script>

