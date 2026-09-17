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
 *
 * REPRODUCCIÓN (añadido, no viene de webunificada): el kit dibuja el botón de
 * play pero no reproduce nada. Con la prop opcional `videoUrl` el reproductor
 * sustituye a la miniatura dentro de la propia pieza, igual que ya hace
 * MoleculeTestimonial en su forma "video".
 *
 * Sin `videoUrl` el marcado es exactamente el de antes —un <a> que lleva a
 * `href`—, así que nada de lo que ya la usaba cambia. Con `videoUrl` la raíz
 * pasa a ser un <div> y el control es un <a> aparte: un <iframe> dentro de un
 * enlace no es marcado válido, y además el enlace ya no navega a ningún sitio.
 */
import { ref, computed, watch } from 'vue';
import AtomIcon from '../atoms/AtomIcon.vue';
import AtomEyebrow from '../atoms/AtomEyebrow.vue';
import { toVideoSource } from '../../helpers/video';

const props = withDefaults(defineProps<{
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
  /**
   * YouTube, Vimeo o un archivo .mp4/.webm.
   *
   * Sin esto el botón de play es decorativo y la pieza navega a `href`, como
   * en el kit.
   */
  videoUrl?: string;
}>(), {
  variant: 'simple',
});

const classes = computed(() => [
  'video-preview',
  props.variant === 'featured' ? 'video-preview--featured' : null,
]);

/** El overlay editorial solo si hay algo que poner dentro. */
const hasContent = computed(() => Boolean(props.eyebrow || props.title));

/* -------------------------------------------------------------------------- */
/* Reproducción dentro de la pieza                                             */
/* -------------------------------------------------------------------------- */

const playing = ref(false);

const video = computed(() => toVideoSource(props.videoUrl));

/** ¿Hay algo que reproducir? Un play que no reproduce nada engaña. */
const isPlayable = computed(() => video.value.kind !== 'none');

/** Sin fuente no hay `src`; la plantilla no puede estrechar ese tipo sola. */
const videoSrc = computed(() => (video.value.kind === 'none' ? '' : video.value.src));

const playLabel = computed(() => props.ariaLabel || 'Reproducir el video');

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
  <!-- Con video: la pieza reproduce, así que no es un enlace. -->
  <div v-if="isPlayable" :class="[...classes, playing ? 'is-playing' : null]">
    <div v-if="playing" class="video-preview__player">
      <iframe
        v-if="video.kind === 'iframe'"
        :src="videoSrc"
        :title="playLabel"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowfullscreen
      ></iframe>
      <video
        v-else
        :src="videoSrc"
        :poster="image || undefined"
        controls
        autoplay
        playsinline
      ></video>
    </div>

    <template v-else>
      <img v-if="image" :src="image" :alt="imageAlt || ''" loading="lazy" />
      <span v-if="variant === 'featured' && duration" class="video-preview__duration">{{ duration }}</span>

      <!--
        Control de reproducción como <a> —nunca <button>, nunca <span>— por la
        decisión de proyecto que documenta AtomButton. El ancla no navega, así
        que se le compensa a mano lo que un <button> daría de fábrica: rol,
        foco, Enter y Espacio.
      -->
      <a
        class="video-preview__play"
        role="button"
        tabindex="0"
        :aria-label="playLabel"
        @click="playing = true"
        @keydown="onPlayKeydown"
      >
        <span class="video-preview__play-btn">
          <AtomIcon name="play" :size="22" />
        </span>
      </a>

      <span v-if="variant !== 'featured' && duration" class="video-preview__duration">{{ duration }}</span>
      <span v-if="variant === 'featured' && hasContent" class="video-preview__content">
        <AtomEyebrow v-if="eyebrow">{{ eyebrow }}</AtomEyebrow>
        <span v-if="title" class="video-preview__content-title">{{ title }}</span>
      </span>
    </template>
  </div>

  <!-- Sin video: el marcado del kit, intacto. -->
  <a v-else :class="classes" :href="href || '#'" :aria-label="ariaLabel">
    <!-- Sin imagen no se emite <img>: un src vacío da un icono roto. -->
    <img v-if="image" :src="image" :alt="imageAlt || ''" loading="lazy" />
    <span v-if="variant === 'featured' && duration" class="video-preview__duration">{{ duration }}</span>
    <span class="video-preview__play">
      <span class="video-preview__play-btn">
        <AtomIcon name="play" :size="22" />
      </span>
    </span>
    <span v-if="variant !== 'featured' && duration" class="video-preview__duration">{{ duration }}</span>
    <span v-if="variant === 'featured' && hasContent" class="video-preview__content">
      <AtomEyebrow v-if="eyebrow">{{ eyebrow }}</AtomEyebrow>
      <span v-if="title" class="video-preview__content-title">{{ title }}</span>
    </span>
  </a>
</template>
