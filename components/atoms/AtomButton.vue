<script setup lang="ts">
import { computed, resolveComponent } from 'vue';

type ButtonVariant = 'primary' | 'secondary' | 'terciary' | 'white' | 'surface' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

const props = withDefaults(defineProps<{
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: boolean;
  negative?: boolean;
  disabled?: boolean;
  /** Destino: soporta rutas internas ('/universidad') o externas */
  href?: string;
  to?: string;
}>(), {
  variant: 'primary',
  size: 'md',
});

const targetUrl = computed(() => props.to || props.href);
const isAction = computed(() => !targetUrl.value);

// Determinar el componente dinámico según el entorno y destino
const linkTag = computed(() => {
  if (props.disabled || isAction.value) return 'a';

  // Si estamos en Nuxt, resuelve NuxtLink; si estamos en Vue SPA puro, RouterLink; si falla, 'a'
  try {
    const nuxtLink = resolveComponent('NuxtLink');
    if (typeof nuxtLink !== 'string') return nuxtLink;
  } catch (_) {}

  try {
    const routerLink = resolveComponent('RouterLink');
    if (typeof routerLink !== 'string') return routerLink;
  } catch (_) {}

  return 'a';
});

const classes = computed(() => [
  'btn',
  `btn--${props.variant}`,
  props.size !== 'md' ? `btn--${props.size}` : null,
  props.icon ? 'btn--icon' : null,
  props.negative ? 'btn--negative' : null,
  props.disabled ? 'is-disabled' : null,
]);

const onKeydown = (event: KeyboardEvent) => {
  if (props.disabled || !isAction.value) return;
  if (event.key !== 'Enter' && event.key !== ' ') return;

  event.preventDefault();
  (event.currentTarget as HTMLElement).click();
};
</script>

<template>
  <component
    :is="linkTag"
    :to="disabled ? undefined : targetUrl"
    :href="disabled ? undefined : targetUrl"
    :role="isAction ? 'button' : undefined"
    :tabindex="disabled ? -1 : (isAction ? 0 : undefined)"
    :aria-disabled="disabled ? 'true' : undefined"
    :class="classes"
    @keydown="onKeydown"
  >
    <slot />
  </component>
</template>