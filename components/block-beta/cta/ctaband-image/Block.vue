<template>
  <section class="ctaband ctaband--image">
    <img
      v-if="data.image"
      class="ctaband__bg"
      v-bind="edit('image')"
      :src="data.image"
      :alt="data.imageAlt || ''"
      loading="lazy"
    />

    <!-- El fondo sangra; el contenido se limita al ancho del contenedor -->
    <div class="ctaband__inner">
      <div class="ctaband__content">
        <p v-if="data.eyebrow" class="ctaband__eyebrow" v-bind="edit('eyebrow')">{{ data.eyebrow }}</p>
        <h2 v-if="data.title" class="ctaband__title" v-bind="edit('title')">{{ data.title }}</h2>
        <p v-if="data.desc" class="ctaband__desc" v-bind="edit('desc')">{{ data.desc }}</p>

        <CtaActions
          :primary="primary"
          :secondary="secondary"
          :button-count="buttonCount"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * CTA Band — variante con imagen de fondo y texto a la izquierda.
 *
 * El velo es opaco sobre la columna de texto y se difumina hacia la derecha,
 * dejando ver la foto cuanto más lejos del borde izquierdo.
 */
import { computed } from 'vue';
import CtaActions from '../_shared/CtaActions.vue';
import { normalizeAction, normalizeButtonCount } from '../_shared/types';
import { useEditTarget } from '../../../../core/editFocus';

/* Marcas para el enfoque de campos del constructor (core/editFocus.ts). */
const edit = useEditTarget();

const props = defineProps<{ data: any }>();

const buttonCount = computed(() => normalizeButtonCount(props.data?.buttonCount));
const primary = computed(() => normalizeAction(props.data?.primary));
const secondary = computed(() => normalizeAction(props.data?.secondary));
</script>
