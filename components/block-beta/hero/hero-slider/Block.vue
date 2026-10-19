<template>
  <section v-if="slides.length" class="hero" :style="panelStyle">
    <!--
      Título principal de la página, para buscadores y lectores de pantalla.

      Vive aquí y no dentro de cada diapositiva: es UNO para toda la portada.
      Dentro de HeroSlide se remontaría en cada cambio de diapositiva, y si algún
      día se montaran todas a la vez habría tantos <h1> como diapositivas.

      Oculto con .visually-hidden y NO con el atributo `hidden`: `hidden` hace
      display: none, y lo que no se renderiza sale del árbol de accesibilidad y
      los buscadores lo tratan como contenido oculto, que es justo lo contrario
      de lo que se busca. .hero ya es position: relative con overflow: hidden,
      así que el elemento recortado queda contenido.

      Según la elección del editor, ESAN queda oculto o el texto visible elegido
      se renderiza como H1.
    -->
    <h1 v-if="seoHeadingText" class="visually-hidden">{{ seoHeadingText }}</h1>

    <!--
      Solo se monta la diapositiva visible. Apilarlas todas y ocultarlas
      obligaría a fijar la altura por adelantado, y en móvil el alto lo decide
      el texto de cada una.

      La `key` fuerza el remontaje al cambiar: sin ella, Vue reutilizaría el
      mismo <img> y la foto anterior se quedaría a la vista mientras carga la
      siguiente.
    -->
    <HeroSlide
      :key="active.id"
      v-bind="edit(`slides.${current}`)"
      :seo-heading-source="seoHeadingSource"
      :eyebrow="active.eyebrow"
      :title="active.title"
      :desc="active.desc"
      :image="active.image"
      :image-alt="active.imageAlt"
      :image-focus-x="active.imageFocusX"
      :image-focus-y="active.imageFocusY"
      :image-focus-profiles="active.imageFocusProfiles"
      :primary="active.primary"
      :secondary="active.secondary"
      :eager="current === 0"
    />

    <!-- Con una sola diapositiva no hay nada que recorrer. -->
    <HeroControls
      v-if="slides.length > 1"
      :current="current"
      :total="slides.length"
      @prev="go(-1)"
      @next="go(1)"
    />
  </section>
</template>

<script setup lang="ts">
/**
 * Carrusel de portada.
 *
 * Foto a sangre con el bloque de texto encima, y flechas con contador para
 * recorrer las diapositivas. El contenido se escribe desde el editor; no
 * consulta ninguna API.
 *
 * El H1 SEO es único y oculto; se puede tomar de ESAN o del título/antetítulo
 * de la diapositiva activa. Los textos visibles conservan su marcado actual.
 *
 * Sin dependencia de carrusel: no hay ninguna en uso en la librería, y esto es
 * un índice y dos flechas.
 */
import { ref, computed, watch } from 'vue';
import HeroSlide from '../_shared/HeroSlide.vue';
import HeroControls from '../_shared/HeroControls.vue';
import {
  heroOverlayStyle,
  heroPanelStyle,
  normalizeHeroAction,
  normalizeHeroButtons,
  normalizeHeroMode,
  normalizeHeroSeoHeadingSource,
  resolveHeroActions,
  type HeroSlideItem,
} from '../_shared/types';
import {
  normalizeImageFocus,
  normalizeImageFocusProfiles,
} from '../../../../helpers/imageFocus';
import { useEditTarget } from '../../../../core/editFocus';

/* Marcas para el enfoque de campos del constructor (core/editFocus.ts). */
const edit = useEditTarget();

const props = defineProps<{ data: any }>();

/* Color de la franja: la hoja lo lee de --hero-panel-bg (ver _hero.scss). */
const panelStyle = computed(() => ({
  ...heroPanelStyle(props.data?.panelColorToken),
  // Intensidad del velo sobre la foto: la hoja lo lee de --hero-overlay.
  ...heroOverlayStyle(props.data?.overlayOpacity),
}));

/*
 * En modo `single` solo cuenta la primera diapositiva. Las demás siguen en el
 * dato (el editor las conserva), pero ni se dibujan ni cuentan para las flechas
 * y el contador: con una sola ya no salen.
 */
const slides = computed<HeroSlideItem[]>(() => {
  const all = Array.isArray(props.data?.slides) ? props.data.slides : [];
  const raw = normalizeHeroMode(props.data?.mode) === 'single' ? all.slice(0, 1) : all;

  return raw.map((slide: any, i: number) => {
    const imageFocusX = normalizeImageFocus(slide?.imageFocusX);
    const imageFocusY = normalizeImageFocus(slide?.imageFocusY);
    const actions = resolveHeroActions(
      normalizeHeroButtons(slide?.buttons, normalizeHeroAction(slide?.secondary)),
      normalizeHeroAction(slide?.primary),
      normalizeHeroAction(slide?.secondary),
    );

    return ({
    id: slide?.id || `hero-${i}`,
    eyebrow: slide?.eyebrow ?? '',
    title: slide?.title ?? '',
    desc: slide?.desc ?? '',
    image: slide?.image ?? '',
    imageAlt: slide?.imageAlt ?? '',
    imageFocusX,
    imageFocusY,
    imageFocusProfiles: normalizeImageFocusProfiles(
      slide?.imageFocusProfiles,
      imageFocusX,
      imageFocusY,
    ),
    buttons: normalizeHeroButtons(slide?.buttons, normalizeHeroAction(slide?.secondary)),
    primary: actions.primary,
    secondary: actions.secondary,
    });
  }) as HeroSlideItem[];
});

const current = ref(0);

/*
 * Quitar diapositivas desde el editor puede dejar el índice apuntando fuera de
 * la lista. Se recoloca en cuanto eso pasa, en vez de quedarse en blanco.
 */
watch(
  () => slides.value.length,
  (length) => {
    if (current.value > length - 1) current.value = Math.max(0, length - 1);
  },
);

const active = computed(() => slides.value[current.value] ?? slides.value[0]);

const seoHeadingSource = computed(() =>
  slides.value.length > 1
    ? 'esan'
    : normalizeHeroSeoHeadingSource(
    props.data?.seoHeadingSource,
    props.data?.showSeoHeading,
      ),
);

const seoHeadingText = computed(() => {
  if (seoHeadingSource.value !== 'esan') return '';
  return typeof props.data?.seoHeadingText === 'string' && props.data.seoHeadingText.trim()
    ? props.data.seoHeadingText.trim()
    : 'ESAN';
});

/** Avanza o retrocede, dando la vuelta por los extremos. */
const go = (delta: number) => {
  const total = slides.value.length;
  if (total < 2) return;

  // El módulo de un negativo es negativo en JS; el sumando lo corrige.
  current.value = (current.value + delta + total) % total;
};
</script>
