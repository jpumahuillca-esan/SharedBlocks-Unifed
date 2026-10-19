<template>
  <section
    v-if="slides.length"
    ref="root"
    class="hero"
    :style="panelStyle"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
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

      El <Transition> hace el fundido entre diapositivas: la que sale se queda
      debajo (la hoja la saca del flujo) mientras la nueva aparece encima. La
      duración de `duration` es la de --hero-fade en _hero.scss: Vue la usa
      para saber cuándo retirar la que sale.
    -->
    <Transition name="hero-slide" :duration="HERO_FADE_MS">
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
    </Transition>

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
 *
 * Con varias diapositivas avanza sola cada 5 segundos. Se detiene (y cuenta de
 * nuevo al volver) cuando el visitante la está mirando o usando: el puntero
 * encima, el foco del teclado dentro, la pestaña oculta o el bloque fuera de
 * pantalla. Tampoco avanza sola con "reducir movimiento" activado ni dentro del
 * lienzo del editor, donde saltar de diapositiva mientras se escribe estorba.
 *
 * El movimiento (fundido de la foto y entrada escalonada del texto) es CSS puro
 * en _hero.scss: no necesita librería y se pinta desde la primera carga, antes
 * de que el cliente termine de hidratar.
 */
import { ref, computed, watch, inject, onMounted, onBeforeUnmount } from 'vue';
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
import { EDIT_CANVAS_KEY, useEditTarget } from '../../../../core/editFocus';

/** Cada cuánto cambia sola la diapositiva. */
const AUTOPLAY_MS = 5000;

/** Duración del fundido: igual que --hero-fade en _hero.scss. */
const HERO_FADE_MS = 900;

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

/* -------------------------------------------------------------------------
   Avance automático
   ------------------------------------------------------------------------- */
const root = ref<HTMLElement | null>(null);
const inCanvas = inject(EDIT_CANVAS_KEY, false);

/*
 * Todo lo que depende del navegador arranca en onMounted: en el servidor (Nuxt)
 * no hay temporizadores ni matchMedia, y el HTML que sale es el de la primera
 * diapositiva, quieta.
 */
const mounted = ref(false);
const reducedMotion = ref(false);
const pageVisible = ref(true);
const inView = ref(true);
const hovering = ref(false);
const focusing = ref(false);

const running = computed(
  () =>
    mounted.value &&
    !inCanvas &&
    !reducedMotion.value &&
    slides.value.length > 1 &&
    pageVisible.value &&
    inView.value &&
    !hovering.value &&
    !focusing.value,
);

let timer: ReturnType<typeof setTimeout> | undefined;

const stop = () => {
  if (timer) clearTimeout(timer);
  timer = undefined;
};

/*
 * La foto de la siguiente se pide antes de que le toque: las diapositivas que
 * no son la primera cargan en diferido, y sin esto el fundido arrancaría sobre
 * una foto que aún no ha llegado.
 */
const preloadNext = () => {
  const next = slides.value[(current.value + 1) % slides.value.length];
  if (next?.image) new Image().src = next.image;
};

/*
 * Un solo temporizador que se rearma con cada cambio: pasar de diapositiva a
 * mano (flechas) o por el propio avance reinicia la cuenta de 5 segundos, así
 * que nunca salta justo después de un clic.
 */
watch(
  [running, current, () => slides.value.length],
  () => {
    stop();
    if (!running.value) return;
    preloadNext();
    timer = setTimeout(() => go(1), AUTOPLAY_MS);
  },
  { flush: 'post' },
);

/* Solo el ratón pausa por pasar encima: en táctil, el "enter" del toque se
   quedaría puesto y el avance no volvería nunca. */
const onPointerEnter = (event: PointerEvent) => {
  if (event.pointerType === 'mouse') hovering.value = true;
};
const onPointerLeave = () => {
  hovering.value = false;
};

/* Solo el foco de teclado: un clic en una flecha también la enfoca, y eso no
   debe dejar el carrusel parado. */
const onFocusIn = (event: FocusEvent) => {
  const target = event.target as Element | null;
  if (target?.matches?.(':focus-visible')) focusing.value = true;
};
const onFocusOut = (event: FocusEvent) => {
  if (!root.value?.contains(event.relatedTarget as Node | null)) focusing.value = false;
};

let motionQuery: MediaQueryList | undefined;
let observer: IntersectionObserver | undefined;

const syncMotion = () => {
  reducedMotion.value = !!motionQuery?.matches;
};
const syncVisibility = () => {
  pageVisible.value = document.visibilityState !== 'hidden';
};

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  syncMotion();
  motionQuery.addEventListener('change', syncMotion);

  syncVisibility();
  document.addEventListener('visibilitychange', syncVisibility);

  if (root.value && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(([entry]) => {
      inView.value = entry.isIntersecting;
    }, { threshold: 0.25 });
    observer.observe(root.value);
  }

  mounted.value = true;
});

onBeforeUnmount(() => {
  stop();
  motionQuery?.removeEventListener('change', syncMotion);
  document.removeEventListener('visibilitychange', syncVisibility);
  observer?.disconnect();
});

/** Avanza o retrocede, dando la vuelta por los extremos. */
const go = (delta: number) => {
  const total = slides.value.length;
  if (total < 2) return;

  // El módulo de un negativo es negativo en JS; el sumando lo corrige.
  current.value = (current.value + delta + total) % total;
};
</script>
