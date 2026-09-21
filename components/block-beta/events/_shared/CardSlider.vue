<template>
  <div class="card-slider">
    <div
      ref="track"
      class="card-section__grid"
      :style="{ '--card-section-columns': String(columns) }"
      @scroll.passive="syncActive"
    >
      <slot />
    </div>

    <!-- Los puntos solo existen si de verdad hay contenido fuera de la vista -->
    <div v-if="overflows && count > 1" class="card-slider__dots">
      <!--
        Anclas y no <button>, por la decisión de proyecto que documenta
        AtomButton. Un ancla sin destino no es interactiva por sí sola, así que
        se compensa a mano lo que un <button> daría de fábrica: rol, foco y
        teclado. Mismo patrón que las flechas del hero (HeroControls).
      -->
      <a
        v-for="i in count"
        :key="i"
        class="card-slider__dot"
        :class="{ 'is-active': active === i - 1 }"
        role="button"
        tabindex="0"
        :aria-label="`Ir a la tarjeta ${i}`"
        :aria-current="active === i - 1 ? 'true' : undefined"
        @click="goTo(i - 1)"
        @keydown="activate($event, i - 1)"
      ></a>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Carril de tarjetas con indicador de puntos.
 *
 * Cuando las tarjetas no caben, la fila se desplaza en horizontal en lugar de
 * apilarse, y aparecen los puntos para saber en cuál se está y poder saltar.
 *
 * La aparición de los puntos se decide midiendo el desbordamiento real, no por
 * un punto de quiebre: así funciona igual si el bloque vive en una columna
 * estrecha de la página que si ocupa todo el ancho.
 */
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

const props = defineProps<{
  /** Cuántas tarjetas hay dentro. Define cuántos puntos se dibujan. */
  count: number;
  /** Columnas configuradas en el editor, para la vista en rejilla. */
  columns: number;
}>();

const track = ref<HTMLElement | null>(null);
const overflows = ref(false);
const active = ref(0);

/** ¿Hay contenido fuera de la vista? El margen evita falsos positivos. */
const measure = () => {
  const el = track.value;
  if (!el) return;

  overflows.value = el.scrollWidth - el.clientWidth > 2;
  syncActive();
};

/** Marca como activa la tarjeta cuyo borde está más cerca del inicio visible. */
const syncActive = () => {
  const el = track.value;
  if (!el) return;

  const children = Array.from(el.children) as HTMLElement[];
  if (!children.length) return;

  /*
   * Caso del final del recorrido.
   *
   * Al llegar al tope, la última tarjeta queda alineada al borde DERECHO, no al
   * izquierdo. Como la búsqueda por cercanía mira el borde izquierdo, nunca
   * elegía la última y el punto activo se quedaba en la penúltima. Cuando el
   * carril está al final, la activa es la última por definición.
   */
  if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
    active.value = children.length - 1;
    return;
  }

  let nearest = 0;
  let minDistance = Infinity;

  children.forEach((child, i) => {
    const distance = Math.abs(child.offsetLeft - el.offsetLeft - el.scrollLeft);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = i;
    }
  });

  active.value = nearest;
};

const goTo = (index: number) => {
  const el = track.value;
  const child = el?.children[index] as HTMLElement | undefined;
  if (!child) return;

  /*
   * scrollIntoView respeta el scroll-padding del carril y, con 'nearest' en el
   * eje vertical, no arrastra la página hacia arriba o abajo.
   */
  child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
};

/** Un <button> se activa con Enter y Espacio; un <a> sin href, con ninguna. */
const activate = (event: KeyboardEvent, index: number) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;

  // Espacio, sin esto, desplaza la página.
  event.preventDefault();
  goTo(index);
};

let observer: ResizeObserver | null = null;

onMounted(() => {
  measure();

  // El desbordamiento cambia al redimensionar la ventana y también al cambiar
  // el ancho del lienzo del editor, que no dispara 'resize'.
  if (typeof ResizeObserver !== 'undefined' && track.value) {
    observer = new ResizeObserver(measure);
    observer.observe(track.value);
  }

  window.addEventListener('resize', measure);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  window.removeEventListener('resize', measure);
});

// Cambiar el número de tarjetas o de columnas altera el desbordamiento.
watch(
  () => [props.count, props.columns],
  () => nextTick(measure),
);
</script>
