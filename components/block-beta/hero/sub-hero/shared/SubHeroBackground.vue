<template>
  <div class="subhero__background">
    <div class="subhero__brand" :style="panelStyle" v-bind="edit('panelColorToken')"></div>

    <div class="subhero__media" v-bind="edit('image')">
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
import { useEditTarget } from '../../../../../core/editFocus';

/* Marcas para el enfoque de campos del constructor (core/editFocus.ts). */
const edit = useEditTarget();

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