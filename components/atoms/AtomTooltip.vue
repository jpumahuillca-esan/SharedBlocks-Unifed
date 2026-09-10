<script setup lang="ts">
/**
 * AtomTooltip — átomo de tooltip (ARCIS Design System, Elementos >
 * Tooltips).
 *
 * Envuelve las clases .tooltip-trigger/.tooltip-trigger--bottom portadas
 * en assets/styles/elements/_tooltips.scss — CSS puro vía atributo
 * data-tooltip (::before/::after), sin JS. Este átomo solo agrega la
 * clase y el atributo; toda la lógica visual vive en el SCSS.
 *
 * Por defecto se renderiza como <span> con tabindex="0" para que también
 * sea alcanzable con teclado (webunificada muestra el tooltip en :hover
 * y en :focus-visible). Con `as="button"` no agrega tabindex (los
 * <button> ya son focuseables de forma nativa) — así se puede envolver
 * un ícono clickeable, ej.:
 *   <AtomTooltip as="button" text="Copiar enlace" class="btn btn--secondary btn--icon">
 */
import { computed } from 'vue';

type TooltipPosition = 'top' | 'bottom';

const props = withDefaults(defineProps<{
  text: string;
  position?: TooltipPosition;
  as?: string;
}>(), {
  position: 'top',
  as: 'span',
});

const classes = computed(() => [
  'tooltip-trigger',
  props.position === 'bottom' ? 'tooltip-trigger--bottom' : null,
]);
</script>

<template>
  <component
    :is="as"
    :class="classes"
    :data-tooltip="text"
    :tabindex="as === 'button' ? undefined : 0"
  >
    <slot />
  </component>
</template>
