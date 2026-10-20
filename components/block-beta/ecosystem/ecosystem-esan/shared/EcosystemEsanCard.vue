<template>
  <article
    class="ecosystem-esan-card"
    :style="cardStyle"
  >
    <AtomLink
      :href="href || undefined"
      :target="item.target"
      as="div"
      class="ecosystem-esan-card__image-link"
      :aria-label="href ? `Ir a ${title || 'la sección'}` : undefined"
    >
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

    </AtomLink>

    <div
      v-if="title || description || href || item.links.length"
      class="ecosystem-esan-card__body"
    >
      <AtomLink
        v-if="title || description || href"
        :href="href || undefined"
        :target="item.target"
        as="div"
        class="ecosystem-esan-card__main"
        :aria-label="href ? `Ir a ${title || 'la sección'}` : undefined"
      >
        <div v-if="title" class="ecosystem-esan-card__title-row">
          <AtomHeading
            :level="3"
            size="h5"
            weight="semibold"
            class="ecosystem-esan-card__title"
            v-bind="edit('.title')"
          >
            {{ title }}
          </AtomHeading>

          <span
            v-if="href"
            class="ecosystem-esan-card__action btn btn--surface btn--icon"
            aria-hidden="true"
            v-bind="edit('.href')"
          >
            <AtomIcon name="chevron-right" :size="16" />
          </span>
        </div>

        <AtomText
          v-if="description"
          size="body"
          class="ecosystem-esan-card__desc"
          v-bind="edit('.desc')"
        >
          {{ description }}
        </AtomText>
      </AtomLink>

      <span
        v-if="item.links.length"
        class="ecosystem-esan-card__divider"
        aria-hidden="true"
      ></span>

      <ul
        v-if="item.links.length"
        class="ecosystem-esan__links"
        :aria-label="`Enlaces de ${item.title}`"
      >
        <li
          v-for="(link, li) in item.links"
          v-bind="edit(`.links.${li}.label`)"
          :key="link.id"
          class="ecosystem-esan__link-item"
        >
          <AtomButton
            variant="list"
            :href="link.href || undefined"
            :target="link.target"
            class="ecosystem-esan__link"
          >
            <span>{{ link.label }}</span>
              <AtomIcon name="arrow-right" :size="16" class="ecosystem-esan__link-icon" />
          </AtomButton>
        </li>
      </ul>
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
import AtomIcon from '../../../../atoms/AtomIcon.vue';
import AtomLink from '../../../../atoms/AtomLink.vue';
import AtomButton from '../../../../atoms/AtomButton.vue';

import {
  resolveBrandContentToken,
} from '../../../../editor-beta/EditorBrandColor/brandColors';

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
  () => {
    const focus = props.item.imageFocusProfiles;
    const legacyX = props.item.imageFocusX ?? 50;
    const legacyY = props.item.imageFocusY ?? 50;

    const focusPosition = (mode: 'web' | 'tablet' | 'mobile') => {
      const point = focus?.[mode];
      return `${point?.x ?? legacyX}% ${point?.y ?? legacyY}%`;
    };

    return ({
      '--ecosystem-esan-card-color':
        `var(${props.item.colorToken})`,

      '--ecosystem-esan-card-content':
        `var(${resolveBrandContentToken(
          props.item.colorToken,
        )})`,
      '--ecosystem-esan-image-focus-web': focusPosition('web'),
      '--ecosystem-esan-image-focus-tablet': focusPosition('tablet'),
      '--ecosystem-esan-image-focus-mobile': focusPosition('mobile'),
    }) as CSSProperties;
  },
);
</script>
