<template>
  <section v-if="slides.length" class="hero">
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

      Se puede desactivar desde el editor para las páginas que ya tienen su
      propio <h1>.
    -->
    <h1 v-if="showSeoHeading" class="visually-hidden">ESAN</h1>

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
      :eyebrow="active.eyebrow"
      :title="active.title"
      :desc="active.desc"
      :image="active.image"
      :image-alt="active.imageAlt"
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
 * Titulares: el <h1> de la página es uno solo, "ESAN", oculto a la vista y fijo
 * en el bloque. El título de cada diapositiva es un párrafo con aspecto de
 * titular, en todas, incluida la primera: así el título principal no cambia
 * según qué diapositiva esté a la vista ni según cuál se haya puesto primero.
 *
 * Sin dependencia de carrusel: no hay ninguna en uso en la librería, y esto es
 * un índice y dos flechas.
 */
import { ref, computed, watch } from 'vue';
import HeroSlide from '../_shared/HeroSlide.vue';
import HeroControls from '../_shared/HeroControls.vue';
import {
  normalizeHeroAction,
  normalizeShowSeoHeading,
  type HeroSlideItem,
} from '../_shared/types';

const props = defineProps<{ data: any }>();

const showSeoHeading = computed(() => normalizeShowSeoHeading(props.data?.showSeoHeading));

const slides = computed<HeroSlideItem[]>(() => {
  const raw = Array.isArray(props.data?.slides) ? props.data.slides : [];

  return raw.map((slide: any, i: number) => ({
    id: slide?.id || `hero-${i}`,
    eyebrow: slide?.eyebrow ?? '',
    title: slide?.title ?? '',
    desc: slide?.desc ?? '',
    image: slide?.image ?? '',
    imageAlt: slide?.imageAlt ?? '',
    primary: normalizeHeroAction(slide?.primary),
    secondary: normalizeHeroAction(slide?.secondary),
  })) as HeroSlideItem[];
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

/** Avanza o retrocede, dando la vuelta por los extremos. */
const go = (delta: number) => {
  const total = slides.value.length;
  if (total < 2) return;

  // El módulo de un negativo es negativo en JS; el sumando lo corrige.
  current.value = (current.value + delta + total) % total;
};
</script>
