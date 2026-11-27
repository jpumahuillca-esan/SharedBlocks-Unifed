<template>
  <section
    class="why-choose"
    :class="{ 'why-choose--hide-tablet-media': content.hideImageOnTablet }"
    :style="sectionStyle"
    v-bind="edit('colorToken')"
  >
    <img
      v-if="resolvedBgTexture"
      :src="resolvedBgTexture"
      alt=""
      aria-hidden="true"
      class="why-choose__texture"
      :style="{ opacity: content.overlayOpacity / 100 }"
      loading="lazy"
      decoding="async"
    />

    <div class="why-choose__inner">
      <div class="why-choose__content">
        <header
          v-if="content.eyebrow || content.title || content.desc"
          class="why-choose__header"
        >
          <AtomEyebrow
            v-if="content.eyebrow"
            as="p"
            :variant="eyebrowVariant"
            class="why-choose__eyebrow"
            v-bind="edit('eyebrow')"
          >
            {{ content.eyebrow }}
          </AtomEyebrow>

          <AtomHeading
            v-if="content.title"
            :level="2"
            size="h2"
            weight="semibold"
            class="why-choose__title"
            v-bind="edit('title')"
          >
            {{ content.title }}
          </AtomHeading>

          <span
            v-if="content.title"
            class="why-choose__rule"
            aria-hidden="true"
          ></span>

          <AtomText
            v-if="content.desc"
            size="body-lg"
            class="why-choose__desc"
            v-bind="edit('desc')"
          >
            {{ content.desc }}
          </AtomText>
        </header>

        <div v-if="content.items.length" class="why-choose__grid">
          <article
            v-for="(item, index) in content.items"
            :key="item.id"
            class="why-choose__item"
            v-bind="edit(`items.${index}`)"
          >
            <div class="why-choose__icon" v-bind="edit('.pictogram')">
              <AtomPictogram :name="item.pictogram" :size="64" :color="foregroundCssColor" />
            </div>

            <div class="why-choose__item-body">
              <AtomHeading
                v-if="item.title"
                :level="3"
                size="h5"
                weight="semibold"
                class="why-choose__item-title"
                v-bind="edit('.title')"
              >
                {{ item.title }}
              </AtomHeading>

              <AtomText
                v-if="item.desc"
                size="body"
                class="why-choose__item-desc"
                v-bind="edit('.desc')"
              >
                {{ item.desc }}
              </AtomText>
            </div>
          </article>
        </div>
      </div>

      <div
        v-if="content.image"
        class="why-choose__media"
        v-bind="edit('image')"
      >
        <img
          :src="content.image"
          :alt="content.imageAlt || content.title || ''"
          width="427"
          height="369"
          :style="{ objectPosition: `${content.imageFocusX}% ${content.imageFocusY}%` }"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Bloque "Por qué elegir..." sobre superficie oscura con textura wireframe ESAN,
 * grilla 2x2 de pictogramas (AtomPictogram) e imagen lateral redondeada.
 */
import { computed, type CSSProperties } from 'vue';
import AtomEyebrow from '../../../atoms/AtomEyebrow.vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomPictogram from '../../../atoms/AtomPictogram.vue';
import { resolveBrandContentToken } from '../../../editor-beta/EditorBrandColor/brandColors';
import { useEditTarget } from '../../../../core/editFocus';
import {
  DEFAULT_BLUEPRINT_BG,
  DEFAULT_WHY_CHOOSE_BG_COLOR,
  normalizeWhyChooseData,
} from './types';

const props = defineProps<{ data: any }>();
const edit = useEditTarget();

const content = computed(() => normalizeWhyChooseData(props.data));

const contentToken = computed(() => {
  if (content.value.colorToken === DEFAULT_WHY_CHOOSE_BG_COLOR) {
    return '--ds-color-text-inverse';
  }
  return resolveBrandContentToken(content.value.colorToken);
});

const eyebrowVariant = computed(() =>
  contentToken.value === '--ds-color-text-inverse' ? 'inverse' : 'brand',
);

const foregroundCssColor = computed(() => `var(${contentToken.value})`);

const resolvedBgTexture = computed(() => {
  if (content.value.backgroundImage) return content.value.backgroundImage;
  if (content.value.useDefaultBlueprint) return DEFAULT_BLUEPRINT_BG;
  return '';
});

const sectionStyle = computed<CSSProperties>(() => {
  const onDark = contentToken.value === '--ds-color-text-inverse';
  return {
    '--wc-bg': `var(${content.value.colorToken})`,
    '--wc-fg': `var(${contentToken.value})`,
    '--wc-rule': onDark ? '#FFFFFF' : 'var(--ds-color-esan-corp, #E3173E)',
  } as CSSProperties;
});
</script>
