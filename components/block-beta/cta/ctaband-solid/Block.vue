<template>
  <section class="ctaband ctaband--solid">
    <!-- El fondo sangra; el contenido se limita al ancho del contenedor -->
    <div class="ctaband__inner">
      <div class="ctaband__content">
        <p v-if="data.eyebrow" class="ctaband__eyebrow">{{ data.eyebrow }}</p>
        <h2 v-if="data.title" class="ctaband__title">{{ data.title }}</h2>
        <p v-if="data.desc" class="ctaband__desc">{{ data.desc }}</p>

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
 * CTA Band — variante sólida de marca.
 *
 * Fondo corporativo plano con el contenido centrado. Sin textura diagonal ni
 * ícono decorativo: solo el color y la información.
 */
import { computed } from 'vue';
import CtaActions from '../_shared/CtaActions.vue';
import { normalizeAction, normalizeButtonCount } from '../_shared/types';

const props = defineProps<{ data: any }>();

const buttonCount = computed(() => normalizeButtonCount(props.data?.buttonCount));
const primary = computed(() => normalizeAction(props.data?.primary));
const secondary = computed(() => normalizeAction(props.data?.secondary));
</script>
