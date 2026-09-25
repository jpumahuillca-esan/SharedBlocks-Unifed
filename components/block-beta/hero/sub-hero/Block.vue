<template>
  <section class="subhero" :style="panelColorStyle">
    <SubHeroBackground
      :image="image"
      :image-alt="imageAlt"
      :image-focus-x="imageFocusX"
      :image-focus-y="imageFocusY"
      :panel-style="panelColorStyle"
    />

    <SubHeroContent
      :eyebrow="eyebrow"
      :eyebrow-as-h1="eyebrowAsH1"
      :title="title"
      :desc="desc"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SubHeroBackground from './shared/SubHeroBackground.vue';
import SubHeroContent from './shared/SubHeroContent.vue';
import { resolvePanelColorToken } from './shared/config';

const props = defineProps<{ data: any }>();

const eyebrow = computed(() => props.data?.eyebrow ?? '');
const eyebrowAsH1 = computed(() => props.data?.eyebrowAsH1 === true);
const title = computed(() => props.data?.title ?? '');
const desc = computed(() => props.data?.desc ?? '');
const image = computed(() => props.data?.image ?? '');
const imageAlt = computed(() => props.data?.imageAlt ?? '');
const imageFocusX = computed(() => props.data?.imageFocusX ?? 50);
const imageFocusY = computed(() => props.data?.imageFocusY ?? 50);

const panelColorToken = computed(() => resolvePanelColorToken(props.data));

const panelColorStyle = computed(() => ({
  backgroundColor: `var(${panelColorToken.value})`
}));
</script>