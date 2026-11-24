<template>
  <section
    class="international-section-v2"
    :class="{ 'is-light-bg': isDarkTextBg }"
    :style="{
      backgroundColor: `var(${content.backgroundToken})`,
      '--intl-v2-fg': `var(${contentColorToken})`,
      '--intl-v2-rule': `var(${contentColorToken})`,
      '--intl-v2-border': isDarkTextBg ? 'rgba(15, 23, 42, 0.22)' : 'var(--ds-color-border-inverse, #f1f5f9)',
    }"
    v-bind="edit('backgroundToken')"
  >
    <div class="international-section-v2__container">
      <header class="international-section-v2__header">
        <h2 v-if="content.eyebrow" class="international-section-v2__eyebrow" v-bind="edit('eyebrow')">{{ content.eyebrow }}</h2>
        <h3 v-if="content.title" class="international-section-v2__title" v-bind="edit('title')">{{ content.title }}</h3>
        <span class="international-section-v2__rule" aria-hidden="true"></span>
      </header>

      <div class="international-section-v2__body">
        <p v-if="content.description" class="international-section-v2__description" v-html="content.description" v-bind="edit('description')"></p>
        <img
          v-if="content.image"
          class="international-section-v2__image image-focus-responsive"
          :src="content.image"
          :alt="content.imageAlt"
          loading="lazy"
          decoding="async"
          :style="imageFocusStyle"
          v-bind="edit('image')"
        />
        <div v-if="content.rows.length" class="international-section-v2__rows">
          <div v-for="(row, index) in content.rows" :key="row.id" class="international-section-v2__row" v-bind="edit(`rows.${index}`)">
            <h4 class="international-section-v2__row-title" v-bind="edit(`rows.${index}.title`)">{{ row.title }}</h4>
            <p class="international-section-v2__row-text" v-html="row.text" v-bind="edit(`rows.${index}.text`)"></p>
          </div>
        </div>
        <div v-if="content.buttonText" class="international-section-v2__actions" v-bind="edit('buttonText')">
          <AtomButton
            variant="secondary"
            :negative="!isDarkTextBg"
            :href="content.buttonLink || undefined"
            :target="content.buttonTarget || undefined"
            class="international-section-v2__button"
            v-bind="edit('buttonLink')"
          >{{ content.buttonText }}</AtomButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import { DARK_TEXT_BACKGROUND_TOKENS, resolveBrandContentToken } from '../../../editor-beta/EditorBrandColor/brandColors';
import { useEditTarget } from '../../../../core/editFocus';
import { imageFocusProfilesStyle } from '../../../../helpers/imageFocus';
import { normalizeInternationalSection, type InternationalSectionData } from './shared/types';

const props = defineProps<{ data?: Partial<InternationalSectionData> }>();
const edit = useEditTarget();
const content = computed(() => normalizeInternationalSection(props.data));
const contentColorToken = computed(() => resolveBrandContentToken(content.value.backgroundToken));
const isDarkTextBg = computed(() => DARK_TEXT_BACKGROUND_TOKENS.has(content.value.backgroundToken));
const imageFocusStyle = computed(() => imageFocusProfilesStyle(content.value.imageFocusProfiles));
</script>
