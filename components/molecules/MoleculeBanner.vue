<script setup lang="ts">
/**
 * MoleculeBanner — Banner (ARCIS Design System, Elementos > Banners).
 *
 * Vive en components/molecules/ y no en components/atoms/ porque está
 * compuesta de varios átomos (AtomHeading, AtomText, AtomEyebrow,
 * AtomIcon) — mismo criterio que MoleculeCard.
 *
 * Envuelve las clases .banner/.banner--{variante}/.banner__* portadas
 * en assets/styles/elements/_banners.scss. No redeclara estilos propios.
 *
 * Dos formas con DOM distinto, igual que webunificada (no es solo un
 * cambio de clase):
 * - "brand"/"dark"/"outline": <div class="banner ..."> con
 *   .banner__content (eyebrow/título/texto) + .banner__actions (slot
 *   #actions, los botones varían por caso — ver ejemplos en
 *   PreviewBanners.vue) y .banner__icon opcional (prop `icon` o slot
 *   #icon).
 * - "image"/"image-split": <a> (o <div> si no se pasa `href`) con foto
 *   a sangre + degradado + flecha fija — "image-split" es la misma
 *   variante con la clase extra "banner--image-split" agregada.
 *
 * El eyebrow sobre fondo de color necesita ser blanco para verse (rojo
 * sobre rojo es invisible) — se resuelve solo, sin que el consumidor
 * tenga que elegirlo: "outline" (fondo claro) usa el eyebrow normal,
 * "brand"/"dark" usan AtomEyebrow variant="inverse", e "image" ya trae
 * su propia regla CSS descendente (.banner--image .banner__content
 * .eyebrow) que lo fuerza a blanco sin importar la variante del átomo.
 */
import { computed } from 'vue';
import AtomHeading from '../atoms/AtomHeading.vue';
import AtomText from '../atoms/AtomText.vue';
import AtomEyebrow from '../atoms/AtomEyebrow.vue';
import AtomIcon from '../atoms/AtomIcon.vue';

type BannerVariant = 'brand' | 'dark' | 'outline' | 'image' | 'image-split';

const props = withDefaults(defineProps<{
  variant?: BannerVariant;
  eyebrow?: string;
  /** Solo variantes "image"/"image-split": etiqueta de acento sobre el título (ej. "ESAN"). */
  titleAccent?: string;
  title?: string;
  text?: string;
  /** Solo variante "outline": ícono en círculo al costado del contenido. */
  icon?: string;
  /** Solo variantes "image"/"image-split". */
  image?: string;
  imageAlt?: string;
  href?: string;
}>(), {
  variant: 'brand',
});

const isImageVariant = computed(() => props.variant === 'image' || props.variant === 'image-split');

const classes = computed(() => {
  if (props.variant === 'image-split') return ['banner', 'banner--image', 'banner--image-split'];
  if (props.variant === 'image') return ['banner', 'banner--image'];
  return ['banner', `banner--${props.variant}`];
});

const eyebrowVariant = computed(() => (props.variant === 'outline' ? 'brand' : 'inverse'));
</script>

<template>
  <component :is="isImageVariant ? (href ? 'a' : 'div') : 'div'" :href="isImageVariant ? (href || '#') : undefined" :class="classes">
    <template v-if="isImageVariant">
      <div class="banner__media">
        <img :src="image" :alt="imageAlt || ''" loading="lazy" />
      </div>
      <div class="banner__body">
        <div class="banner__content">
          <span v-if="titleAccent" class="banner__title-accent">{{ titleAccent }}</span>
          <AtomEyebrow v-if="eyebrow">{{ eyebrow }}</AtomEyebrow>
          <AtomHeading v-if="title" :level="4" class="banner__title">{{ title }}</AtomHeading>
          <AtomText v-if="text" class="banner__text">{{ text }}</AtomText>
        </div>
        <span class="banner__arrow" aria-hidden="true">
          <AtomIcon name="chevron-right" :size="20" />
        </span>
      </div>
    </template>

    <template v-else>
      <!-- El wrapper icono+contenido va con estilo inline a propósito,
           igual que en webunificada: agrupa ambos para que ".banner"
           (justify-content: space-between) los separe como un solo
           bloque de las acciones, no como ítems sueltos. -->
      <div style="display: flex; align-items: center; gap: var(--space-5)">
        <div v-if="icon || $slots.icon" class="banner__icon">
          <slot name="icon">
            <AtomIcon v-if="icon" :name="icon" :size="22" />
          </slot>
        </div>
        <div class="banner__content">
          <AtomEyebrow v-if="eyebrow" :variant="eyebrowVariant">{{ eyebrow }}</AtomEyebrow>
          <AtomHeading v-if="title" :level="4" class="banner__title">{{ title }}</AtomHeading>
          <AtomText v-if="text" class="banner__text">{{ text }}</AtomText>
        </div>
      </div>
      <div v-if="$slots.actions" class="banner__actions">
        <slot name="actions" />
      </div>
    </template>
  </component>
</template>
