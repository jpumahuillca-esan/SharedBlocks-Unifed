<script setup lang="ts">
/**
 * AtomButton — átomo de botón (ARCIS Design System).
 *
 * Envuelve las clases .btn/.btn--* portadas en assets/styles/components.scss
 * (fuente: webunificada/ui-kit/assets/css/main.css). No redeclara estilos
 * propios: cambiar el look de los botones se hace una sola vez en ese
 * archivo y se propaga a todo lo que use este átomo.
 *
 * Se renderiza como <a> si se pasa `href`, o como <button> en caso
 * contrario (igual que en la guía viva de webunificada, donde los CTA
 * de navegación son <a class="btn ..."> y las acciones son <button>).
 */
import { computed } from 'vue';

type ButtonVariant = 'primary' | 'secondary' | 'terciary' | 'white' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

const props = withDefaults(defineProps<{
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Botón cuadrado solo-ícono (usar con aria-label). */
  icon?: boolean;
  /** Legible sobre fondos oscuros (equivale a btn--negative en ARCIS). */
  negative?: boolean;
  disabled?: boolean;
  /** Si se pasa, se renderiza como <a href="...">. */
  href?: string;
  type?: 'button' | 'submit' | 'reset';
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
});

const tag = computed(() => (props.href ? 'a' : 'button'));

const classes = computed(() => [
  'btn',
  `btn--${props.variant}`,
  props.size !== 'md' ? `btn--${props.size}` : null,
  props.icon ? 'btn--icon' : null,
  props.negative ? 'btn--negative' : null,
]);
</script>

<template>
  <component
    :is="tag"
    :href="href"
    :type="tag === 'button' ? type : undefined"
    :disabled="tag === 'button' ? disabled : undefined"
    :class="classes"
  >
    <slot />
  </component>
</template>
