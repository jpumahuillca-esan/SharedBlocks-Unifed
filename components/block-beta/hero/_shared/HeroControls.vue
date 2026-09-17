<template>
  <div class="hero__controls">
    <AtomText as="p" size="sm" class="hero__counter">
      {{ current + 1 }} de {{ total }}
    </AtomText>

    <div class="hero__arrows">
      <!--
        Anclas y no <button>, por la decisión de proyecto que documenta
        AtomButton. No son AtomButton porque este es un control cuadrado de
        ícono suelto, no un botón del sistema: con las clases .btn tendría que
        deshacerse después medio estilo.

        Un ancla sin destino no es interactiva por sí sola, así que se compensa
        a mano lo que un <button> daría de fábrica: rol, foco y teclado.
      -->
      <a
        class="hero__arrow hero__arrow--prev"
        role="button"
        tabindex="0"
        aria-label="Diapositiva anterior"
        @click="$emit('prev')"
        @keydown="activate($event, 'prev')"
      >
        <AtomIcon name="chevron-right" :size="18" />
      </a>

      <a
        class="hero__arrow hero__arrow--next"
        role="button"
        tabindex="0"
        aria-label="Diapositiva siguiente"
        @click="$emit('next')"
        @keydown="activate($event, 'next')"
      >
        <AtomIcon name="chevron-right" :size="18" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Controles del carrusel de portada: contador y flechas.
 *
 * La flecha de retroceder reutiliza el ícono `chevron-right` girado desde la
 * hoja de estilos. AtomIcon no tiene `chevron-left`, y para un giro de 180
 * grados no compensa ampliar el catálogo de íconos del sistema.
 */
import AtomText from '../../../atoms/AtomText.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';

defineProps<{
  /** Índice de la diapositiva visible, empezando en cero. */
  current: number;
  total: number;
}>();

const emit = defineEmits<{
  (e: 'prev'): void;
  (e: 'next'): void;
}>();

/** Un <button> se activa con Enter y Espacio; un <a> sin href, con ninguna. */
const activate = (event: KeyboardEvent, direction: 'prev' | 'next') => {
  if (event.key !== 'Enter' && event.key !== ' ') return;

  // Espacio, sin esto, desplaza la página.
  event.preventDefault();

  /*
   * Se ramifica en lugar de emitir la variable: `defineEmits` declara dos
   * firmas separadas, y una unión no encaja en ninguna de las dos por sí sola.
   */
  if (direction === 'prev') emit('prev');
  else emit('next');
};
</script>
