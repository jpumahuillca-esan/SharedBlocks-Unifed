<template>
  <section
    class="awards-featured-v2"
    v-bind="edit('backgroundColorToken')"
    :style="{ backgroundColor: `var(${backgroundColorToken})` }"
  >
    <div class="card-section awards awards-featured-v2__inner">
      <CardSectionHeader
        :eyebrow="data.eyebrow ? `— ${data.eyebrow}` : ''"
        eyebrow-as="span"
        title-as="h2"
        :desc="data.desc || ''"
        :title="titleContent.text"
        :link-label="data.linkLabel || ''"
        :link-url="data.linkUrl || ''"
        :link-target="normalizeLinkTarget(data.linkTarget)"
      >
        <template #title>
          <span v-html="titleContent.html"></span>
        </template>
      </CardSectionHeader>

      <CardSlider v-if="awards.length" :count="awards.length" :columns="awards.length">
        <div v-for="(award, i) in awards" :key="award.id" class="awards__item" v-bind="edit(`awards.${i}`)">
          <img
            v-if="award.image"
            class="awards__logo"
            v-bind="edit('.image')"
            :src="award.image"
            :alt="award.imageAlt"
            loading="lazy"
            decoding="async"
          />
          <span v-else class="awards__placeholder" aria-hidden="true" v-bind="edit('.image')"></span>
        </div>
      </CardSlider>

      <p v-if="data.bottomText" class="awards-featured-v2__text" v-bind="edit('bottomText')">
        {{ data.bottomText }}
      </p>

      <CardSectionFooter
        :link-label="data.linkLabel || ''"
        :link-url="data.linkUrl || ''"
        :link-target="normalizeLinkTarget(data.linkTarget)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CardSectionHeader from '../../events/_shared/CardSectionHeader.vue';
import CardSectionFooter from '../../events/_shared/CardSectionFooter.vue';
import CardSlider from '../../events/_shared/CardSlider.vue';
import { normalizeLinkTarget } from '../../../../helpers/linkTarget';
import { useEditTarget } from '../../../../core/editFocus';
import { normalizeBrandColorToken } from '../../../editor-beta/EditorBrandColor/brandColors';

const edit = useEditTarget();
const MAX_AWARDS = 4;

interface AwardItem {
  id: string;
  image: string;
  imageAlt: string;
}

const props = defineProps<{ data: any }>();

const backgroundColorToken = computed(() =>
  normalizeBrandColorToken(props.data?.backgroundColorToken),
);

const titleContent = computed(() => {
  const value = props.data?.title;
  if (typeof value !== 'string' || !value) return { html: '', text: '' };
  if (typeof DOMParser === 'undefined') {
    const text = value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return { html, text };
  }

  const parsed = new DOMParser().parseFromString(value, 'text/html');
  const output = document.createElement('span');
  const allowedTags = new Set(['SPAN', 'STRONG', 'B', 'EM', 'I', 'U', 'S']);
  const blockedTags = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'SVG', 'MATH', 'TEMPLATE']);

  const copyNode = (source: Node, target: HTMLElement): void => {
    if (source.nodeType === Node.TEXT_NODE) {
      target.appendChild(document.createTextNode(source.textContent || ''));
      return;
    }
    if (!(source instanceof HTMLElement) || blockedTags.has(source.tagName)) return;
    if (source.tagName === 'BR') {
      target.appendChild(document.createElement('br'));
      return;
    }
    if (source.tagName === 'P' || source.tagName === 'DIV') {
      if (target.childNodes.length) target.appendChild(document.createElement('br'));
      source.childNodes.forEach((child) => copyNode(child, target));
      return;
    }
    if (allowedTags.has(source.tagName)) {
      const clean = document.createElement(source.tagName.toLowerCase());
      if (source.tagName === 'SPAN') {
        const color = source.style.color.trim();
        if (color && typeof CSS !== 'undefined' && CSS.supports('color', color)) clean.style.color = color;
      }
      source.childNodes.forEach((child) => copyNode(child, clean));
      target.appendChild(clean);
      return;
    }
    source.childNodes.forEach((child) => copyNode(child, target));
  };

  parsed.body.childNodes.forEach((node) => copyNode(node, output));
  return {
    html: output.innerHTML.replace(/(?:<br>)+$/, ''),
    text: (output.textContent || '').replace(/\s+/g, ' ').trim(),
  };
});

const awards = computed<AwardItem[]>(() => {
  const raw = Array.isArray(props.data?.awards) ? props.data.awards : [];
  return raw.slice(0, MAX_AWARDS).map((award: any, i: number) => ({
    id: award?.id || `award-${i}`,
    image: typeof award?.image === 'string' ? award.image.trim() : '',
    imageAlt: award?.imageAlt ?? '',
  }));
});
</script>

