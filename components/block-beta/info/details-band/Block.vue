<template>
  <section
    class="details-band"
    :class="{ 'details-band--wide': content.contentWidth === 'wide' }"
    :style="bandStyle"
    v-bind="edit('colorToken')"
  >
    <div class="details-band__inner">
      <header
        v-if="content.eyebrow || content.title"
        class="details-band__header"
      >
        <AtomEyebrow
          v-if="content.eyebrow"
          as="p"
          :variant="eyebrowVariant"
          class="details-band__eyebrow"
          v-bind="edit('eyebrow')"
        >
          {{ content.eyebrow }}
        </AtomEyebrow>

        <AtomHeading
          v-if="content.title"
          :level="2"
          size="h4"
          weight="semibold"
          class="details-band__title"
          v-bind="edit('title')"
        >
          {{ content.title }}
        </AtomHeading>

        <span
          v-if="content.title"
          class="details-band__rule"
          aria-hidden="true"
        ></span>
      </header>

      <div v-if="content.items.length" class="details-band__grid">
        <article
          v-for="(item, index) in content.items"
          :key="item.id"
          class="details-band__item"
          v-bind="edit(`items.${index}`)"
        >
          <span
            v-if="item.icon"
            class="details-band__icon"
            aria-hidden="true"
            v-bind="edit('.icon')"
          >
            <AtomIcon :name="item.icon" :size="32" />
          </span>

          <div class="details-band__item-body">
            <AtomHeading
              v-if="item.title"
              :level="3"
              size="h5"
              weight="semibold"
              class="details-band__item-title"
              v-bind="edit('.title')"
            >
              {{ item.title }}
            </AtomHeading>

            <AtomText
              v-if="item.desc"
              size="body"
              class="details-band__item-desc"
              v-bind="edit('.desc')"
            >
              {{ item.desc }}
            </AtomText>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Banda de detalles / público objetivo en color institucional.
 * Reutiliza AtomEyebrow, AtomHeading, AtomText, AtomIcon y EditorBrandColor.
 */
import { computed, type CSSProperties } from 'vue';
import AtomEyebrow from '../../../atoms/AtomEyebrow.vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import { resolveBrandContentToken } from '../../../editor-beta/EditorBrandColor/brandColors';
import { useEditTarget } from '../../../../core/editFocus';
import { normalizeDetailsBandData } from './types';

const props = defineProps<{ data: any }>();
const edit = useEditTarget();

const content = computed(() => normalizeDetailsBandData(props.data));

const contentToken = computed(() => resolveBrandContentToken(content.value.colorToken));
const eyebrowVariant = computed(() => (contentToken.value === '--ds-color-text-inverse' ? 'inverse' : 'brand'));

const bandStyle = computed<CSSProperties>(() => {
  const onDark = contentToken.value === '--ds-color-text-inverse';
  return {
    '--details-band-bg': `var(${content.value.colorToken})`,
    '--details-band-fg': `var(${contentToken.value})`,
    '--details-band-rule': onDark ? 'var(--ds-color-background-light, #F1F5F9)' : 'var(--ds-color-esan-corp, #E3173E)',
  } as CSSProperties;
});
</script>
