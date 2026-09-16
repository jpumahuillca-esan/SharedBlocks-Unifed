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
  /**
   * Solo "media": varias etiquetas.
   *
   * Tiene prioridad sobre `tag`, que se conserva para el caso de una sola y
   * para no romper a quien ya lo usaba.
   */
  badges?: string[];
}>(), {
  variant: 'standard',
});
</script>

<template>
  <article :class="['event-card', variant === 'media' ? 'event-card--media' : null]">
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

          La primera va en sólido y las siguientes en la versión suave, para que
          se lea cuál es la principal sin que compitan entre sí.
        -->
        <div v-if="badges?.length" class="event-card__badges">
          <AtomBadge
            v-for="(badge, i) in badges"
            :key="i"
            as="p"
            :variant="i === 0 ? 'brand-solid' : 'brand'"
          >
            {{ badge }}
          </AtomBadge>
        </div>
        <AtomBadge v-else-if="tag" as="p" variant="brand-solid">{{ tag }}</AtomBadge>
        <!--
          Nivel y tamaño son cosas distintas y por eso se pasan por separado.

          El nivel es jerarquía: la tarjeta vive dentro de una sección cuyo
          título es un h2, así que le corresponde h3. Antes pedía nivel 7, que
          no existe: generaba una etiqueta <h7> inválida y buscaba un token de
          tamaño inexistente.

          `size` es obligatorio porque AtomHeading fija el tamaño en línea y así
          gana sobre la hoja de estilos.

          size="body" (16px) y no h6 (18px): en la maqueta el título de esta
          variante va al tamaño del texto corrido, apenas por encima de la
          descripción de la sección. Sigue siendo un <h3>.
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
      <AtomButton v-if="ctaLabel" variant="secondary" size="sm">{{ ctaLabel }}</AtomButton>
    </template>
  </article>
</template>
