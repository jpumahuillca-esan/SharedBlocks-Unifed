<script setup lang="ts">
/**
 * AtomLink — átomo de navegación polimórfico (ARCIS Design System).
 *
 * Mismo comportamiento y resolución dinámica que AtomButton:
 * - Nuxt 3 (public-site): NuxtLink (navegación SPA reactiva).
 * - Vue Router (front): RouterLink.
 * - Sin destino / Inactivo: Etiqueta semántica vía `as` (por defecto 'div').
 * - Fallback: Etiqueta <a> nativa.
 */
import { computed, resolveComponent } from 'vue';

const props = withDefaults(defineProps<{
  href?: string;
  to?: string;
  disabled?: boolean;
  as?: string;
}>(), {
  as: 'div',
});

const targetUrl = computed(() => props.to || props.href);
const isAction = computed(() => !targetUrl.value);

// Determinar el componente exactamente igual que AtomButton
const linkTag = computed(() => {
  if (props.disabled || isAction.value) return props.as;

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

// Atributos limpios: jamás envía 'to' y 'href' juntos
const linkProps = computed(() => {
  if (props.disabled || isAction.value || !targetUrl.value) {
    return {};
  }

  // Si es un ancla HTML nativa, solo pasamos href
  if (linkTag.value === 'a') {
    return { href: targetUrl.value };
  }

  // Si es NuxtLink o RouterLink, pasamos solo 'to' (NuxtLink maneja enlaces externos e internos)
  return { to: targetUrl.value };
});
</script>

<template>
  <component :is="linkTag" v-bind="linkProps">
    <slot />
  </component>
</template>
