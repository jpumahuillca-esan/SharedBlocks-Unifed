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
  href?: string;
  to?: string;
}>(), {
  variant: 'primary',
  size: 'md',
});

const targetUrl = computed(() => props.to || props.href);
const isAction = computed(() => !targetUrl.value);

// Determinar el componente
const linkTag = computed(() => {
  if (props.disabled || isAction.value) return 'a';

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
    v-bind="linkProps"
    :role="isAction ? 'button' : undefined"
    :tabindex="disabled ? -1 : (isAction ? 0 : undefined)"
    :aria-disabled="disabled ? 'true' : undefined"
    :class="classes"
    @keydown="onKeydown"
  >
    <slot />
  </component>
</template>