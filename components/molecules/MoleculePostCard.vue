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
  /**
   * Solo "news": varias etiquetas sobre la imagen.
   *
   * Tiene prioridad sobre `tag`, que se conserva para el caso de una sola y
   * para no romper a quien ya lo usaba.
   */
  badges?: string[];
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
      <!-- Sin imagen no se emite <img>: un src vacío da un icono roto. -->
      <img v-if="image" :src="image" :alt="imageAlt || ''" loading="lazy" />
      <div v-if="variant === 'news' && badges?.length" class="post-card__tags">
        <p v-for="(badge, i) in badges" :key="i" class="post-card__tag">{{ badge }}</p>
      </div>
      <p v-else-if="variant === 'news' && tag" class="post-card__tag">{{ tag }}</p>
    </div>

    <div class="post-card__body">
      <template v-if="variant === 'news'">
        <p v-if="date" class="post-card__date">{{ date }}</p>
        <!--
          Nivel y tamaño son cosas distintas y por eso se pasan por separado.

          El nivel es jerarquía: la tarjeta vive dentro de una sección cuyo
          título es un h2, así que le corresponde h3. Saltar a h4 dejaría un
          hueco en el esquema de la página.

          `size` es obligatorio: AtomHeading fija el tamaño como estilo en línea
          y un estilo en línea gana sobre la hoja de estilos. Sin él, el título
          se dibujaría al tamaño que le toque al nivel y la regla de
          .post-card__title (--ds-text-h6) nunca llegaría a aplicarse.
        -->
        <AtomHeading v-if="title" :level="3" size="h6" class="post-card__title">{{ title }}</AtomHeading>
        <AtomDivider />
        <AtomButton variant="link" class="post-card__link" :href="href || '#'">
          {{ ctaLabel }}
          <AtomIcon name="arrow-right" :size="16" />
        </AtomButton>
      </template>

      <template v-else>
        <AtomEyebrow v-if="eyebrow">{{ eyebrow }}</AtomEyebrow>
        <AtomHeading v-if="title" :level="3" size="h6" class="post-card__title">{{ title }}</AtomHeading>
        <AtomText v-if="excerpt" class="post-card__excerpt">{{ excerpt }}</AtomText>
        <div v-if="publishedDate || readingTime" class="post-card__meta">
          <p v-if="publishedDate">{{ publishedDate }}</p>
          <p v-if="publishedDate && readingTime" aria-hidden="true">·</p>
          <p v-if="readingTime">{{ readingTime }}</p>
        </div>
      </template>
    </div>
  </article>
</template>
