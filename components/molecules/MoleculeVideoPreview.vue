<script setup lang="ts">
/**
 * MoleculeVideoPreview — miniatura con botón de reproducción (ARCIS
 * Design System, Elementos > Video preview), placeholder visual para
 * embeber video real.
 *
 * Vive en components/molecules/ y no en components/atoms/ porque
 * compone AtomIcon (play fijo) y, en la variante "featured", AtomEyebrow
 * — mismo criterio que MoleculeBanner.
 *
 * Envuelve las clases .video-preview, .video-preview__* y
 * .video-preview--featured portadas en
 * assets/styles/elements/_video-preview.scss. No redeclara estilos
 * propios.
 *
 * "featured" agrega la duración arriba y un overlay editorial (eyebrow +
 * título) abajo, con el botón de play en vidrio esmerilado — igual que
 * webunificada, es la misma etiqueta <a> con más contenido adentro, no
 * un componente aparte.
 */
import AtomIcon from '../atoms/AtomIcon.vue';
import AtomEyebrow from '../atoms/AtomEyebrow.vue';

withDefaults(defineProps<{
  variant?: 'simple' | 'featured';
  image?: string;
  imageAlt?: string;
  duration?: string;
  /** Solo "featured". */
  eyebrow?: string;
  /** Solo "featured". */
  title?: string;
  href?: string;
  ariaLabel?: string;
}>(), {
  variant: 'simple',
});
</script>

<template>
  <a
    :class="['video-preview', variant === 'featured' ? 'video-preview--featured' : null]"
    :href="href || '#'"
    :aria-label="ariaLabel"
  >
    <img :src="image" :alt="imageAlt || ''" loading="lazy" />
    <span v-if="variant === 'featured' && duration" class="video-preview__duration">{{ duration }}</span>
    <span class="video-preview__play">
      <span class="video-preview__play-btn">
        <AtomIcon name="play" :size="22" />
      </span>
    </span>
    <span v-if="variant !== 'featured' && duration" class="video-preview__duration">{{ duration }}</span>
    <span v-if="variant === 'featured'" class="video-preview__content">
      <AtomEyebrow v-if="eyebrow">{{ eyebrow }}</AtomEyebrow>
      <span v-if="title" class="video-preview__content-title">{{ title }}</span>
    </span>
  </a>
</template>
