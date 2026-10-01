<template>
  <article
    class="ecosystem-esan-card"
    :style="cardStyle"
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

    <div class="ecosystem-esan-card__body">
      <div class="ecosystem-esan-card__text">
        <AtomHeading
          v-if="item.title"
          :level="3"
          size="h5"
          weight="semibold"
          class="ecosystem-esan-card__title"
          v-bind="edit('.title')"
        >
          {{ item.title }}
        </AtomHeading>

        <AtomText
          v-if="item.desc"
          size="body"
          class="ecosystem-esan-card__desc"
          v-bind="edit('.desc')"
        >
          {{ item.desc }}
        </AtomText>
      </div>

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
    </div>
  </article>
</template>

<script setup lang="ts">
import {
  computed,
  type CSSProperties,
} from 'vue';

import AtomHeading from '../../../../atoms/AtomHeading.vue';
import AtomText from '../../../../atoms/AtomText.vue';
import AtomButton from '../../../../atoms/AtomButton.vue';
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