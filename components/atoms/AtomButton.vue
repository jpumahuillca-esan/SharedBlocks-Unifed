<script setup lang="ts">
/**
 * AtomButton — átomo de botón (ARCIS Design System).
 *
 * Envuelve las clases .btn/.btn--* portadas en assets/styles/elements/_buttons
 * (fuente: webunificada/ui-kit/assets/css/main.css). No redeclara estilos
 * propios: cambiar el look de los botones se hace una sola vez en ese archivo
 * y se propaga a todo lo que use este átomo.
 *
 * SIEMPRE se renderiza como <a>, nunca como <button>, por decisión de proyecto
 * (criterio de posicionamiento). Eso tiene una consecuencia de accesibilidad
 * que se compensa aquí: un ancla sin destino no es interactiva por sí sola, así
 * que cuando no hay `href` se le da rol de botón, se la hace enfocable y se
 * atiende Enter y Espacio, que es lo que un <button> haría de fábrica.
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
  /** Destino. Sin él, el átomo actúa como disparador de una acción. */
  href?: string;
}>(), {
  variant: 'primary',
  size: 'md',
});

/** Sin destino, el ancla es un disparador de acción, no un enlace. */
const isAction = computed(() => !props.href);

const classes = computed(() => [
  'btn',
  `btn--${props.variant}`,
  props.size !== 'md' ? `btn--${props.size}` : null,
  props.icon ? 'btn--icon' : null,
  props.negative ? 'btn--negative' : null,
  // El sistema ofrece .is-disabled porque :disabled no aplica a un <a>.
  props.disabled ? 'is-disabled' : null,
]);

const onKeydown = (event: KeyboardEvent) => {
  if (props.disabled || !isAction.value) return;
  if (event.key !== 'Enter' && event.key !== ' ') return;

  // Un <button> se activa con ambas teclas; un <a> sin href, con ninguna.
  event.preventDefault();
  (event.currentTarget as HTMLElement).click();
};
</script>

<template>
  <a
    :href="disabled ? undefined : href"
    :role="isAction ? 'button' : undefined"
    :tabindex="disabled ? -1 : (isAction ? 0 : undefined)"
    :aria-disabled="disabled ? 'true' : undefined"
    :class="classes"
    @keydown="onKeydown"
  >
    <slot />
  </a>
</template>
