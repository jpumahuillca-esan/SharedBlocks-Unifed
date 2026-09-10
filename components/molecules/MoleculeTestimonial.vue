<script setup lang="ts">
/**
 * MoleculeTestimonial — card individual de testimonio (ARCIS Design
 * System, Elementos > Testimonials), la pieza que compondrá un
 * carrusel o grid de testimonios.
 *
 * Vive en components/molecules/ y no en components/atoms/ porque está
 * compuesta de varios átomos (AtomAvatar, AtomIcon, AtomButton) —
 * mismo criterio que MoleculeCard/MoleculeBanner.
 *
 * Envuelve las clases .testimonial-card, .testimonial-card__* y
 * .testimonial-card--video portadas en
 * assets/styles/elements/_testimonials.scss. No redeclara estilos propios.
 *
 * Dos formas con DOM distinto, igual que webunificada:
 * - "standard": cita + autor (avatar, nombre, rol), con calificación de
 *   estrellas opcional (prop `rating`, no aparece en la muestra visible
 *   de la guía viva pero sí en su snippet de código documentado).
 * - "video": foto a sangre + botón de play + overlay con nombre, rol y
 *   un CTA (".testimonial-card__cta" siempre va junto a ".btn.btn--link",
 *   no tiene regla base propia — ver _testimonials.scss).
 */
import { computed } from 'vue';
import AtomAvatar from '../atoms/AtomAvatar.vue';
import AtomIcon from '../atoms/AtomIcon.vue';
import AtomButton from '../atoms/AtomButton.vue';

const props = withDefaults(defineProps<{
  variant?: 'standard' | 'video';
  /** Solo "standard": cantidad de estrellas llenas (1-5). Opcional. */
  rating?: number;
  quote?: string;
  authorName: string;
  authorRole?: string;
  /** Solo "standard". Sin imagen, AtomAvatar cae a iniciales. */
  authorAvatar?: string;
  /** Solo "video". */
  image?: string;
  imageAlt?: string;
  ctaLabel?: string;
  href?: string;
}>(), {
  variant: 'standard',
  ctaLabel: 'Ver historia',
});

const initials = computed(() =>
  props.authorName
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
);
</script>

<template>
  <article v-if="variant === 'video'" class="testimonial-card testimonial-card--video">
    <div class="testimonial-card__media">
      <img :src="image" :alt="imageAlt || authorName" loading="lazy" />
    </div>
    <span class="testimonial-card__play">
      <span class="testimonial-card__play-btn">
        <AtomIcon name="play" :size="20" />
      </span>
    </span>
    <div class="testimonial-card__overlay">
      <p class="testimonial-card__author-name">{{ authorName }}</p>
      <span class="testimonial-card__accent"></span>
      <p v-if="authorRole" class="testimonial-card__author-role">{{ authorRole }}</p>
      <AtomButton variant="link" class="testimonial-card__cta" :href="href || '#'">
        {{ ctaLabel }}
        <AtomIcon name="arrow-right" :size="16" />
      </AtomButton>
    </div>
  </article>

  <article v-else class="testimonial-card">
    <div v-if="rating" class="testimonial-card__rating">
      <AtomIcon v-for="n in rating" :key="n" name="star" :size="16" />
    </div>
    <p v-if="quote" class="testimonial-card__quote">&quot;{{ quote }}&quot;</p>
    <div class="testimonial-card__author">
      <AtomAvatar size="sm" :image="authorAvatar" :initials="initials" />
      <div>
        <p class="testimonial-card__author-name">{{ authorName }}</p>
        <p v-if="authorRole" class="testimonial-card__author-role">{{ authorRole }}</p>
      </div>
    </div>
  </article>
</template>
