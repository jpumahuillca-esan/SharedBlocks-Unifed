<script setup lang="ts">
/**
 * MoleculeScrollTop — botón flotante "volver arriba" (ARCIS Design
 * System, Elementos > Scroll top).
 *
 * Vive en components/molecules/ y no en components/atoms/ porque
 * compone el átomo AtomIcon (ícono fijo "arrow-up") — mismo criterio
 * que MoleculeAlert.
 *
 * Envuelve ".scroll-top"/".scroll-top--preview"/".is-visible" portadas
 * en assets/styles/elements/_scroll-top.scss. Replica el comportamiento
 * real de webunificada (assets/js/main.js, initScrollTop()): aparece
 * cuando window.scrollY > 400, scroll suave al hacer click respetando
 * prefers-reduced-motion — es el primer Elemento de esta librería que
 * necesita JS de verdad, no solo CSS.
 *
 * `preview`: modo vista previa — fuerza el botón siempre visible y
 * position:absolute (.scroll-top--preview) en vez de escuchar el scroll
 * real de la ventana y quedar position:fixed. Sin esto, al mostrarlo en
 * el flyout de hover del sidebar del editor se escaparía del recuadro y
 * aparecería flotando sobre la UI real del editor — mismo problema que
 * resuelve ".scroll-top--preview" en la propia página de webunificada.
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import AtomIcon from '../atoms/AtomIcon.vue';

const THRESHOLD = 400;

const props = withDefaults(defineProps<{
  preview?: boolean;
}>(), {
  preview: false,
});

const visible = ref(props.preview);

const handleScroll = () => {
  visible.value = window.scrollY > THRESHOLD;
};

const scrollToTop = () => {
  if (props.preview) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
};

onMounted(() => {
  if (!props.preview) {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
});

onBeforeUnmount(() => {
  if (!props.preview) {
    window.removeEventListener('scroll', handleScroll);
  }
});

const classes = computed(() => [
  'scroll-top',
  props.preview ? 'scroll-top--preview' : null,
  visible.value ? 'is-visible' : null,
]);
</script>

<template>
  <button
    type="button"
    :class="classes"
    aria-label="Volver arriba"
    :tabindex="preview ? -1 : undefined"
    @click="scrollToTop"
  >
    <AtomIcon name="arrow-up" :size="20" />
  </button>
</template>
