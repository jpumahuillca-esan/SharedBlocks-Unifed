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

      <!-- Variante 2 (Figma Talleres para Adolescentes 2679:51664): texto libre ancho completo + link -->
      <div
        v-if="content.layoutMode === 'narrative' && (narrativeParagraphs.length || content.linkLabel)"
        class="details-band__narrative"
      >
        <div
          v-if="narrativeParagraphs.length"
          class="details-band__narrative-body"
          v-bind="edit('bodyText')"
        >
          <p
            v-for="(para, pIdx) in narrativeParagraphs"
            :key="pIdx"
            class="details-band__narrative-text"
          >
            <template v-for="(seg, sIdx) in para" :key="sIdx">
              <strong v-if="seg.bold">{{ seg.text }}</strong>
              <template v-else>{{ seg.text }}</template>
            </template>
          </p>
        </div>

        <AtomButton
          v-if="content.linkLabel"
          variant="link"
          :negative="isOnDark"
          :href="content.linkUrl || undefined"
          :target="content.linkUrl ? content.linkTarget : undefined"
          class="details-band__link"
          v-bind="edit('linkLabel')"
        >
          <span>{{ content.linkLabel }}</span>
          <AtomIcon v-if="content.linkIcon" :name="content.linkIcon" :size="16" aria-hidden="true" />
        </AtomButton>
      </div>

      <!-- Variante 1 (Figma Landing Extended Learning 3464:28904): 2 columnas de tarjetas -->
      <div v-else-if="content.items.length" class="details-band__grid">
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
 * Soporta tarjetas en 2 columnas o texto narrativo con enlace opcional.
 */
import { computed, type CSSProperties } from 'vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomEyebrow from '../../../atoms/AtomEyebrow.vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import AtomText from '../../../atoms/AtomText.vue';
import { parseInlineBoldParagraphs } from '../../../../helpers/inlineMarkdown';
import { resolveBrandContentToken } from '../../../editor-beta/EditorBrandColor/brandColors';
import { useEditTarget } from '../../../../core/editFocus';
import { normalizeDetailsBandData } from './types';

const props = defineProps<{ data: any }>();
const edit = useEditTarget();

const content = computed(() => normalizeDetailsBandData(props.data));

const contentToken = computed(() => resolveBrandContentToken(content.value.colorToken));
const isOnDark = computed(() => contentToken.value === '--ds-color-text-inverse');
const eyebrowVariant = computed(() => (isOnDark.value ? 'inverse' : 'brand'));

const narrativeParagraphs = computed(() => parseInlineBoldParagraphs(content.value.bodyText));

const bandStyle = computed<CSSProperties>(() => ({
  '--details-band-bg': `var(${content.value.colorToken})`,
  '--details-band-fg': `var(${contentToken.value})`,
  '--details-band-rule': isOnDark.value
    ? 'var(--ds-color-background-light, #F1F5F9)'
    : 'var(--ds-color-esan-corp, #E3173E)',
}) as CSSProperties);
</script>
