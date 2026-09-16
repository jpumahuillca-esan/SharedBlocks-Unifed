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
 *
 * REPRODUCCIÓN (añadido, no viene de webunificada): la forma "video" del kit
 * dibuja el botón de play pero no reproduce nada — es una maqueta. Con la prop
 * opcional `videoUrl` el control pasa a reproducir, y el reproductor sustituye
 * a la foto dentro de la propia tarjeta.
 *
 * El control de play es un <a> en los dos casos, no un <button> ni el <span>
 * del kit: es la misma decisión de proyecto que documenta AtomButton. Cuando
 * reproduce, el ancla no navega y se compensa a mano lo que un <button> daría
 * de fábrica (rol, foco, Enter y Espacio); cuando no hay video, apunta a la
 * historia.
 */
import { ref, computed, watch } from 'vue';
import AtomAvatar from '../atoms/AtomAvatar.vue';
import AtomIcon from '../atoms/AtomIcon.vue';
import AtomButton from '../atoms/AtomButton.vue';
import { toVideoSource } from '../../helpers/video';

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
  /**
   * Solo "video". YouTube, Vimeo o un archivo .mp4/.webm.
   *
   * Sin esto el botón de play es decorativo, como en el kit.
   */
  videoUrl?: string;
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

/* -------------------------------------------------------------------------- */
/* Reproducción dentro de la tarjeta                                           */
/* -------------------------------------------------------------------------- */

const playing = ref(false);

const video = computed(() => toVideoSource(props.videoUrl));

/** ¿Hay algo que reproducir? Un play que no reproduce nada engaña. */
const isPlayable = computed(() => video.value.kind !== 'none');

const playLabel = computed(() =>
  props.authorName
    ? `Reproducir el testimonio de ${props.authorName}`
    : 'Reproducir el testimonio'
);

/**
 * Un <button> se activa con Enter y Espacio; un <a> sin href, con ninguna de
 * las dos. Se atienden a mano, igual que hace AtomButton.
 */
const onPlayKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;

  // Espacio, sin esto, desplaza la página.
  event.preventDefault();
  playing.value = true;
};

/*
 * Si cambia el video, se vuelve al estado de reposo. Sin esto, editar la URL
 * desde el panel con el reproductor abierto dejaría montado el video anterior
 * hasta recargar.
 */
watch(
  () => props.videoUrl,
  () => {
    playing.value = false;
  }
);
</script>

<template>
  <article
    v-if="variant === 'video'"
    class="testimonial-card testimonial-card--video"
    :class="{ 'is-playing': playing }"
  >
    <!--
      Reproduciendo, el video ocupa el hueco entero de la tarjeta: la foto, el
      velo y el overlay desaparecen para no taparlo.
    -->
    <div v-if="playing" class="testimonial-card__player">
      <iframe
        v-if="video.kind === 'iframe'"
        :src="video.src"
        :title="playLabel"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowfullscreen
      ></iframe>
      <video
        v-else
        :src="video.src"
        :poster="image || undefined"
        controls
        autoplay
        playsinline
      ></video>
    </div>

    <template v-else>
      <div class="testimonial-card__media">
        <!-- Sin imagen no se emite <img>: un src vacío da un icono roto. -->
        <img v-if="image" :src="image" :alt="imageAlt || authorName" loading="lazy" />
      </div>

      <!--
        Control de reproducción.

        Va como <a> —nunca <button>, nunca <span>— por la misma decisión de
        proyecto que documenta AtomButton: en esta librería los controles se
        renderizan como anclas.

        Con video, el ancla no navega: dispara la reproducción en la propia
        tarjeta. Un ancla sin destino no es interactiva por sí sola, así que se
        le da rol de botón, se la hace enfocable y se atienden Enter y Espacio,
        que es lo que un <button> haría de fábrica. Misma compensación que
        AtomButton.
      -->
      <a
        v-if="isPlayable"
        class="testimonial-card__play testimonial-card__play--action"
        role="button"
        tabindex="0"
        :aria-label="playLabel"
        @click="playing = true"
        @keydown="onPlayKeydown"
      >
        <span class="testimonial-card__play-btn">
          <AtomIcon name="play" :size="20" />
        </span>
      </a>

      <!--
        Sin video que reproducir, el ancla lleva a la historia en vez de quedarse
        muerta. Si tampoco hay destino, es puro adorno y se oculta a los lectores
        de pantalla: un ícono de play que no reproduce ni navega no aporta nada
        que anunciar.
      -->
      <a
        v-else
        class="testimonial-card__play"
        :href="href || undefined"
        :aria-label="href ? playLabel : undefined"
        :aria-hidden="href ? undefined : 'true'"
      >
        <span class="testimonial-card__play-btn">
          <AtomIcon name="play" :size="20" />
        </span>
      </a>

      <div class="testimonial-card__overlay">
        <p class="testimonial-card__author-name">{{ authorName }}</p>
        <span class="testimonial-card__accent"></span>
        <p v-if="authorRole" class="testimonial-card__author-role">{{ authorRole }}</p>
        <AtomButton variant="link" class="testimonial-card__cta" :href="href || '#'">
          {{ ctaLabel }}
          <AtomIcon name="arrow-right" :size="16" />
        </AtomButton>
      </div>
    </template>
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
