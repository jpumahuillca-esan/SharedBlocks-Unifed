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

import { sanitizeTitleHtml } from '../../../../helpers/sanitizeTitleHtml';

const backgroundColorToken = computed(() =>
  normalizeBrandColorToken(props.data?.backgroundColorToken),
);

const titleContent = computed(() => sanitizeTitleHtml(props.data?.title));

const awards = computed<AwardItem[]>(() => {
  const raw = Array.isArray(props.data?.awards) ? props.data.awards : [];
  return raw.slice(0, MAX_AWARDS).map((award: any, i: number) => ({
    id: award?.id || `award-${i}`,
    image: typeof award?.image === 'string' ? award.image.trim() : '',
    imageAlt: award?.imageAlt ?? '',
  }));
});
</script>

