<script setup lang="ts">
/**
 * MoleculePostCard — card de artículo (ARCIS Design System, Elementos >
 * Post Card): imagen, categoría, título y extracto.
 *
 * Vive en components/molecules/ y no en components/atoms/ porque está
 * compuesta de varios átomos (AtomHeading, AtomText, AtomEyebrow,
 * AtomDivider, AtomButton, AtomIcon) — mismo criterio que
 * MoleculeCard/MoleculeBanner.
 *
 * Envuelve las clases .post-card, .post-card__* y .post-card--news
 * portadas en assets/styles/elements/_post-card.scss. No redeclara
 * estilos propios.
 *
 * Dos variantes, con el mismo .post-card__media + .post-card__body
 * pero contenido distinto adentro (no es solo cambio de clase):
 * - "standard": eyebrow (categoría) + título + extracto + meta (fecha ·
 *   tiempo de lectura).
 * - "news": etiqueta sobre la imagen + fecha simple + título + divider
 *   + link ("post-card__link" siempre va junto a ".btn.btn--link", no
 *   tiene más regla propia que align-self — ver _post-card.scss).
 */
import AtomHeading from '../atoms/AtomHeading.vue';
import AtomText from '../atoms/AtomText.vue';
import AtomEyebrow from '../atoms/AtomEyebrow.vue';
import AtomDivider from '../atoms/AtomDivider.vue';
import AtomButton from '../atoms/AtomButton.vue';
import AtomIcon from '../atoms/AtomIcon.vue';

withDefaults(defineProps<{
  variant?: 'standard' | 'news';
  image?: string;
  imageAlt?: string;
  /** Solo "standard": categoría, ej. "Liderazgo". */
  eyebrow?: string;
  /** Solo "news": etiqueta sobre la imagen, ej. "Actualidad". */
  tag?: string;
  /** Solo "news": fecha simple, ej. "09/07/2026". */
  date?: string;
  title?: string;
  /** Solo "standard". */
  excerpt?: string;
  /** Solo "standard", meta izquierda. */
  publishedDate?: string;
  /** Solo "standard", meta derecha. */
  readingTime?: string;
  /** Solo "news". */
  ctaLabel?: string;
  href?: string;
}>(), {
  variant: 'standard',
  ctaLabel: 'Leer artículo',
});
</script>

<template>
  <article :class="['post-card', variant === 'news' ? 'post-card--news' : null]">
    <div class="post-card__media">
      <img :src="image" :alt="imageAlt || ''" loading="lazy" />
      <span v-if="variant === 'news' && tag" class="post-card__tag">{{ tag }}</span>
    </div>

    <div class="post-card__body">
      <template v-if="variant === 'news'">
        <span v-if="date" class="post-card__date">{{ date }}</span>
        <AtomHeading v-if="title" :level="4" class="post-card__title">{{ title }}</AtomHeading>
        <AtomDivider />
        <AtomButton variant="link" class="post-card__link" :href="href || '#'">
          {{ ctaLabel }}
          <AtomIcon name="arrow-right" :size="16" />
        </AtomButton>
      </template>

      <template v-else>
        <AtomEyebrow v-if="eyebrow">{{ eyebrow }}</AtomEyebrow>
        <AtomHeading v-if="title" :level="4" class="post-card__title">{{ title }}</AtomHeading>
        <AtomText v-if="excerpt" class="post-card__excerpt">{{ excerpt }}</AtomText>
        <div v-if="publishedDate || readingTime" class="post-card__meta">
          <span v-if="publishedDate">{{ publishedDate }}</span>
          <span v-if="publishedDate && readingTime">·</span>
          <span v-if="readingTime">{{ readingTime }}</span>
        </div>
      </template>
    </div>
  </article>
</template>
