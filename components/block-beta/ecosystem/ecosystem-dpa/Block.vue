<template>
  <section
    class="ecosystem-dpa"
    :style="{ backgroundColor: dataNormalized.backgroundColor || '#F1F5F9' }"
    v-bind="edit('backgroundColor')"
  >
    <div class="ecosystem-dpa__inner">
      <header
        v-if="dataNormalized.eyebrow || dataNormalized.title || dataNormalized.desc"
        class="ecosystem-dpa__header"
      >
        <AtomText
          v-if="dataNormalized.eyebrow"
          size="body-sm"
          weight="semibold"
          class="ecosystem-dpa__eyebrow"
          v-bind="edit('eyebrow')"
        >
          {{ dataNormalized.eyebrow }}
        </AtomText>

        <AtomHeading
          v-if="dataNormalized.title"
          :level="2"
          size="h2"
          weight="semibold"
          class="ecosystem-dpa__title"
          v-bind="edit('title')"
        >
          {{ dataNormalized.title }}
        </AtomHeading>

        <span
          v-if="dataNormalized.title"
          class="ecosystem-dpa__rule"
          aria-hidden="true"
        ></span>

        <AtomText
          v-if="dataNormalized.desc"
          size="body-lg"
          class="ecosystem-dpa__desc"
          v-bind="edit('desc')"
        >
          {{ dataNormalized.desc }}
        </AtomText>
      </header>

      <div
        v-if="dataNormalized.items.length"
        class="ecosystem-dpa__list"
      >
        <article
          v-for="(item, i) in dataNormalized.items"
          :key="item.id"
          class="ecosystem-dpa-card"
          :style="cardStyle(item)"
          v-bind="edit(`items.${i}`)"
        >
          <AtomLink
            :href="item.href || undefined"
            :target="item.target"
            as="div"
            class="ecosystem-dpa-card__media-link"
            :aria-label="item.href ? `Ir a ${item.title || 'la facultad'}` : undefined"
          >
            <div class="ecosystem-dpa-card__media" v-bind="edit('.image')">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.imageAlt || item.title || ''"
                width="390"
                height="250"
                loading="lazy"
                decoding="async"
              />
              <div
                v-else
                class="ecosystem-dpa-card__media-empty"
                aria-hidden="true"
              >
                <AtomIcon name="image" :size="32" />
              </div>
            </div>
          </AtomLink>

          <div class="ecosystem-dpa-card__wrapper">
            <AtomLink
              :href="item.href || undefined"
              :target="item.target"
              as="div"
              class="ecosystem-dpa-card__head"
              :aria-label="item.href ? `Ir a ${item.title || 'la facultad'}` : undefined"
            >
              <div class="ecosystem-dpa-card__head-text">
                <AtomHeading
                  v-if="item.title"
                  :level="2"
                  size="h5"
                  weight="semibold"
                  class="ecosystem-dpa-card__title"
                  v-bind="edit('.title')"
                >
                  {{ item.title }}
                </AtomHeading>

                <AtomText
                  v-if="item.desc"
                  size="body"
                  class="ecosystem-dpa-card__desc"
                  v-bind="edit('.desc')"
                >
                  {{ item.desc }}
                </AtomText>
              </div>

              <span
                class="ecosystem-dpa-card__arrow"
                aria-hidden="true"
                v-bind="edit('.href')"
              >
                <AtomIcon name="chevron-right" :size="24" />
              </span>
            </AtomLink>

            <ul
              v-if="item.links.length"
              class="ecosystem-dpa-card__links"
              :aria-label="`Carreras de ${item.title}`"
            >
              <li
                v-for="(link, li) in item.links"
                :key="link.id"
                class="ecosystem-dpa-card__link-item"
                v-bind="edit(`.links.${li}.label`)"
              >
                <AtomButton
                  variant="list"
                  :href="link.href || undefined"
                  :target="link.target"
                  class="ecosystem-dpa-card__link"
                >
                  <span class="ecosystem-dpa-card__link-label">{{ link.label }}</span>
                  <AtomIcon name="arrow-right" :size="16" class="ecosystem-dpa-card__link-icon" />
                </AtomButton>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import AtomLink from '../../../atoms/AtomLink.vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import { resolveBrandContentToken } from '../../../editor-beta/EditorBrandColor/brandColors';
import { useEditTarget } from '../../../../core/editFocus';
import {
  normalizeEcosystemDpaData,
  type EcosystemDpaItem,
} from './types';

const edit = useEditTarget();

const props = defineProps<{
  data: any;
}>();

const dataNormalized = computed(() => normalizeEcosystemDpaData(props.data));

const cardStyle = (item: EcosystemDpaItem): CSSProperties => {
  const focus = item.imageFocusProfiles;
  const legacyX = item.imageFocusX ?? 50;
  const legacyY = item.imageFocusY ?? 50;

  return {
    '--ecosystem-dpa-card-color': `var(${item.colorToken || '--ds-color-univ-dpa'})`,
    '--ecosystem-dpa-card-content-color': `var(${resolveBrandContentToken(item.colorToken || '--ds-color-univ-dpa')})`,
    '--ecosystem-dpa-focus-web-x': `${focus?.web?.x ?? legacyX}%`,
    '--ecosystem-dpa-focus-web-y': `${focus?.web?.y ?? legacyY}%`,
    '--ecosystem-dpa-focus-tablet-x': `${focus?.tablet?.x ?? legacyX}%`,
    '--ecosystem-dpa-focus-tablet-y': `${focus?.tablet?.y ?? legacyY}%`,
    '--ecosystem-dpa-focus-mobile-x': `${focus?.mobile?.x ?? legacyX}%`,
    '--ecosystem-dpa-focus-mobile-y': `${focus?.mobile?.y ?? legacyY}%`,
  } as CSSProperties;
};
</script>

