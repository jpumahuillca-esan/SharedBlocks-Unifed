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
 * Envuelve las clases .event-card* portadas en
 * assets/styles/elements/_event-card.scss. No redeclara estilos propios.
 *
 * La clase "event-card--arcis" no es decorativa: sin ella la tarjeta se
 * queda sin estilos. Es el marcador que aísla esta hoja del bloque
 * blocks/grillas/eventos-noticias, que usa los mismos nombres de clase
 * con markup propio (ver la cabecera de _event-card.scss).
 *
 * Dos formatos con DOM distinto, igual que webunificada:
 * - "standard": bloque de fecha + cuerpo (título, hora y lugar) + botón.
 *   En ancho va en fila; en angosto se apila solo, con el botón debajo
 *   alineado con el título.
 * - "media": imagen con el badge de fecha superpuesto + etiquetas +
 *   título. Por defecto vertical; con layout="row", la imagen pasa a la
 *   izquierda y el contenido a su lado (y vuelve a la vertical sola
 *   cuando no hay ancho).
 */
import { computed } from 'vue';
import AtomHeading from '../atoms/AtomHeading.vue';
import AtomIcon from '../atoms/AtomIcon.vue';
import AtomButton from '../atoms/AtomButton.vue';
import AtomBadge, { type BadgeVariant } from '../atoms/AtomBadge.vue';

/** Una etiqueta suelta, o con su variante propia si se quiere otro color. */
export type EventCardBadge = string | { label: string; variant?: BadgeVariant };

const props = withDefaults(defineProps<{
  variant?: 'standard' | 'media';
  /**
   * Forma de la tarjeta. "auto" deja que mande el ancho disponible.
   * "stacked" fuerza el apilado del formato sin imagen; "row" pone la
   * imagen al costado en el formato con imagen.
   */
  layout?: 'auto' | 'stacked' | 'row';
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
  /**
   * Solo "media": varias etiquetas.
   *
   * Tiene prioridad sobre `tag`, que se conserva para el caso de una sola y
   * para no romper a quien ya lo usaba.
   */
  badges?: EventCardBadge[];
}>(), {
  variant: 'standard',
  layout: 'auto',
});

const classes = computed(() => [
  'event-card',
  'event-card--arcis',
  props.variant === 'media' ? 'event-card--media' : null,
  props.layout === 'row' ? 'event-card--row' : null,
  props.layout === 'stacked' ? 'event-card--stacked' : null,
]);

/**
 * Colores de las etiquetas: la primera en rojo sólido y las siguientes en
 * azul claro, como en la lámina. Quien necesite otra combinación puede
 * pasar la variante etiqueta por etiqueta.
 */
const resolvedBadges = computed(() =>
  (props.badges ?? []).map((badge, i) => {
    const porDefecto: BadgeVariant = i === 0 ? 'brand-solid' : 'info';
    return typeof badge === 'string'
      ? { label: badge, variant: porDefecto }
      : { label: badge.label, variant: badge.variant ?? porDefecto };
  })
);
</script>

<template>
  <article :class="classes">
    <template v-if="variant === 'media'">
      <div class="event-card__media">
        <!-- Sin imagen no se emite <img>: un src vacío da un icono roto. -->
        <img v-if="image" :src="image" :alt="imageAlt || ''" loading="lazy" />
        <div class="event-card__date-badge">
          <p class="event-card__date-badge-day">{{ day }}</p>
          <p class="event-card__date-badge-month">{{ month }}</p>
        </div>
      </div>
      <div class="event-card__media-body">
        <!--
          Las etiquetas van en fila, no apiladas: el cuerpo de la tarjeta es una
          columna, así que necesitan su propio contenedor horizontal.
        -->
        <div v-if="resolvedBadges.length" class="event-card__badges">
          <AtomBadge v-for="(badge, i) in resolvedBadges" :key="i" as="p" :variant="badge.variant">
            {{ badge.label }}
          </AtomBadge>
        </div>
        <AtomBadge v-else-if="tag" as="p" variant="brand-solid">{{ tag }}</AtomBadge>
        <!--
          Nivel y tamaño son cosas distintas y por eso se pasan por separado.

          El nivel es jerarquía: la tarjeta vive dentro de una sección cuyo
          título es un h2, así que le corresponde h3.

          `size` es obligatorio porque AtomHeading fija el tamaño en línea y así
          gana sobre la hoja de estilos. size="body" (16px) y no h6 (18px): en
          la maqueta el título de este formato va al tamaño del texto corrido.
        -->
        <AtomHeading v-if="title" :level="3" size="body" class="event-card__title">
          <a :href="href || '#'">{{ title }}</a>
        </AtomHeading>
      </div>
    </template>

    <template v-else>
      <div class="event-card__date">
        <p class="event-card__date-day">{{ day }}</p>
        <p class="event-card__date-month">{{ month }}</p>
      </div>
      <div class="event-card__body">
        <AtomHeading v-if="title" :level="3" size="h6" class="event-card__title">
          <a :href="href || '#'">{{ title }}</a>
        </AtomHeading>
        <div v-if="time || location" class="event-card__meta">
          <p v-if="time" class="event-card__meta-item">
            <AtomIcon name="clock" :size="15" />
            {{ time }}
          </p>
          <p v-if="location" class="event-card__meta-item">
            <AtomIcon name="map-pin" :size="15" />
            {{ location }}
          </p>
        </div>
      </div>
      <AtomButton v-if="ctaLabel" variant="secondary" size="sm" class="event-card__cta">
        {{ ctaLabel }}
      </AtomButton>
    </template>
  </article>
</template>
