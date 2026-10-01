<template>
  <component
    :is="href ? 'a' : 'article'"
    class="ecosystem-esan-card"
    :class="{ 'ecosystem-esan-card--without-description': !description }"
    :style="cardStyle"
    :href="href || undefined"
    :aria-label="href ? `Ir a ${title || 'la sección'}` : undefined"
  >
    <!-- ================================================================
         Imagen
         ================================================================ -->

    <div class="ecosystem-esan-card__media" v-bind="edit('.image')">
      <img
        v-if="item.image"
        :src="item.image"
        :alt="item.imageAlt || ''"
        width="410"
        height="155"
        loading="lazy"
        decoding="async"
      />

      <div
        v-else
        class="ecosystem-esan-card__media-empty"
        aria-hidden="true"
      >
        <span class="ecosystem-esan-card__media-empty-icon">
          <span class="ecosystem-esan-card__media-empty-sun"></span>
          <span class="ecosystem-esan-card__media-empty-landscape"></span>
        </span>
      </div>
    </div>

    <!-- ================================================================
         Content
         ================================================================ -->

    <div
      v-if="title || description || href"
      class="ecosystem-esan-card__body"
      :class="{ 'ecosystem-esan-card__body--without-link': !href }"
    >
      <div v-if="title || description" class="ecosystem-esan-card__text">
        <AtomHeading
          v-if="title"
          :level="3"
          size="h5"
          weight="semibold"
          class="ecosystem-esan-card__title"
          v-bind="edit('.title')"
        >
          {{ title }}
        </AtomHeading>

        <AtomText
          v-if="description"
          size="body"
          class="ecosystem-esan-card__desc"
          v-bind="edit('.desc')"
        >
          {{ description }}
        </AtomText>
      </div>

      <!-- <span
        v-if="href"
        aria-hidden="true"
        class="ecosystem-esan-card__action btn btn--surface btn--icon" -->
      <AtomButton
        variant="surface"
        icon
        :href="item.href || undefined"
        :aria-label="`Ir a ${item.title || 'la sección'}`"
        class="ecosystem-esan-card__action"
        v-bind="edit('.href')"
      >
        <AtomIcon
          name="chevron-right"
          :size="16"
        />
      </AtomButton>
      <!-- </span> -->
    </div>
  </component>
</template>

<script setup lang="ts">
import {
  computed,
  type CSSProperties,
} from 'vue';

import AtomHeading from '../../../../atoms/AtomHeading.vue';
import AtomText from '../../../../atoms/AtomText.vue';
import AtomIcon from '../../../../atoms/AtomIcon.vue';

import {
  resolveBrandContentToken,
} from '../../../_shared/brandColors';

import type {
  EcosystemEsanItem,
} from './types';
import { useEditTarget } from '../../../../../core/editFocus';

/* Marcas para el enfoque de campos del constructor (core/editFocus.ts). */
const edit = useEditTarget();

const props = defineProps<{
  item: EcosystemEsanItem;
}>();

const title = computed(() => props.item.title?.trim() ?? '');
const description = computed(() => props.item.desc?.trim() ?? '');
const href = computed(() => props.item.href?.trim() ?? '');

const cardStyle = computed<CSSProperties>(
  () =>
    ({
      '--ecosystem-esan-card-color':
        `var(${props.item.colorToken})`,

      '--ecosystem-esan-card-content':
        `var(${resolveBrandContentToken(
          props.item.colorToken,
        )})`,
    }) as CSSProperties,
);
</script>
