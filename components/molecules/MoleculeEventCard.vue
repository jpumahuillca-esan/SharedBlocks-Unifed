<script setup lang="ts">
/**
 * MoleculeEventCard — card de evento con bloque de fecha destacado
 * (ARCIS Design System, Elementos > Event Card), para calendario o
 * agenda académica.
 *
 * Vive en components/molecules/ y no en components/atoms/ porque está
 * compuesta de varios átomos (AtomHeading, AtomIcon, AtomButton,
 * AtomBadge) — mismo criterio que MoleculeCard/MoleculePostCard.
 *
 * Envuelve las clases .event-card, .event-card__* y .event-card--media
 * portadas en assets/styles/elements/_event-card.scss. No redeclara
 * estilos propios.
 *
 * Dos variantes con DOM distinto, igual que webunificada:
 * - "standard": bloque de fecha + cuerpo (título/meta con hora y lugar)
 *   + botón de inscripción, en fila horizontal.
 * - "media": imagen superior con badge de fecha superpuesto + etiqueta
 *   (AtomBadge brand-solid) + título, sin botón.
 */
import AtomHeading from '../atoms/AtomHeading.vue';
import AtomIcon from '../atoms/AtomIcon.vue';
import AtomButton from '../atoms/AtomButton.vue';
import AtomBadge from '../atoms/AtomBadge.vue';

withDefaults(defineProps<{
  variant?: 'standard' | 'media';
  day?: string;
  month?: string;
  title?: string;
  href?: string;
  /** Solo "standard". */
  time?: string;
  /** Solo "standard". */
  location?: string;
  /** Solo "standard": texto del botón, ej. "Inscribirme". Sin esto, no se muestra botón. */
  ctaLabel?: string;
  /** Solo "media". */
  image?: string;
  imageAlt?: string;
  /** Solo "media": etiqueta sobre el cuerpo, ej. "Conferencia informativa". */
  tag?: string;
}>(), {
  variant: 'standard',
});
</script>

<template>
  <article :class="['event-card', variant === 'media' ? 'event-card--media' : null]">
    <template v-if="variant === 'media'">
      <div class="event-card__media">
        <img :src="image" :alt="imageAlt || ''" loading="lazy" />
        <div class="event-card__date-badge">
          <span class="event-card__date-badge-day">{{ day }}</span>
          <span class="event-card__date-badge-month">{{ month }}</span>
        </div>
      </div>
      <div class="event-card__media-body">
        <AtomBadge v-if="tag" variant="brand-solid">{{ tag }}</AtomBadge>
        <AtomHeading v-if="title" :level="4" class="event-card__title">
          <a :href="href || '#'">{{ title }}</a>
        </AtomHeading>
      </div>
    </template>

    <template v-else>
      <div class="event-card__date">
        <span class="event-card__date-day">{{ day }}</span>
        <span class="event-card__date-month">{{ month }}</span>
      </div>
      <div class="event-card__body">
        <AtomHeading v-if="title" :level="4" class="event-card__title">
          <a :href="href || '#'">{{ title }}</a>
        </AtomHeading>
        <div v-if="time || location" class="event-card__meta">
          <span v-if="time" class="event-card__meta-item">
            <AtomIcon name="clock" :size="15" />
            {{ time }}
          </span>
          <span v-if="location" class="event-card__meta-item">
            <AtomIcon name="map-pin" :size="15" />
            {{ location }}
          </span>
        </div>
      </div>
      <AtomButton v-if="ctaLabel" variant="secondary" size="sm">{{ ctaLabel }}</AtomButton>
    </template>
  </article>
</template>
