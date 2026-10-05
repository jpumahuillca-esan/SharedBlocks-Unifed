<script setup lang="ts">
import { computed, resolveComponent } from 'vue';
import { linkTargetAttrs } from '../../helpers/linkTarget';

/**
 * Variantes del Figma de arcis-2 (ver la cabecera de _buttons.scss):
 * primary · secondary · terciary (con caja) · text ("Button Icon") ·
 * link ("Button Link") · list ("List-Link") · light (blanco, para superficies
 * claras) · surface (translúcido, sobre paneles de color) · white (= primary
 * con negative). Con `icon`, el "button-arrow".
 */
type ButtonVariant = 'primary' | 'secondary' | 'terciary' | 'white' | 'surface' | 'link' | 'text' | 'list' | 'light';
type ButtonSize = 'sm' | 'md' | 'lg';

const props = withDefaults(defineProps<{
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: boolean;
  negative?: boolean;
  disabled?: boolean;
  href?: string;
  to?: string;
  /**
   * `_blank` abre el destino en una pestaña nueva (y añade el `rel` de
   * seguridad). Sin él, se abre en la misma página. Solo aplica si hay destino.
   */
  target?: string;
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

  // Pestaña nueva: `target` y `rel` viajan igual en el ancla nativa y en los componentes de ruta.
  const extra = linkTargetAttrs(props.target);

  // Si es un ancla HTML nativa, solo pasamos href
  if (linkTag.value === 'a') {
    return { href: targetUrl.value, ...extra };
  }

  // Si es NuxtLink o RouterLink, pasamos solo 'to' (NuxtLink maneja enlaces externos e internos)
  return { to: targetUrl.value, ...extra };
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