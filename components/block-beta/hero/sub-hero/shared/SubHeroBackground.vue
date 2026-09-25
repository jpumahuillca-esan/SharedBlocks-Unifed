<template>
  <div class="subhero__background">
    <div class="subhero__brand" :style="panelStyle"></div>

    <div class="subhero__media">
      <img
        v-if="image"
        :src="image"
        :alt="imageAlt"
        width="880"
        height="360"
        loading="eager"
        fetchpriority="high"
        :style="{ objectPosition: `${imageFocusX}% ${imageFocusY}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    image: string;
    imageAlt?: string;
    imageFocusX?: number;
    imageFocusY?: number;
    panelStyle: Record<string, string>;
  }>(),
  {
    imageAlt: '',
    imageFocusX: 50,
    imageFocusY: 50
  }
);
</script>