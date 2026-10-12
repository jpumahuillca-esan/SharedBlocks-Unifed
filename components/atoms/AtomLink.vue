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
import { computed, inject, resolveComponent } from 'vue';
import { useRouter } from 'vue-router';
import { linkTargetAttrs } from '../../helpers/linkTarget';
import { EDIT_CANVAS_KEY } from '../../core/editFocus';

const props = withDefaults(defineProps<{
  href?: string;
  to?: string;
  disabled?: boolean;
  as?: string;
  /**
   * `_blank` abre el destino en una pestaña nueva (y añade el `rel` de
   * seguridad). Sin él, se abre en la misma página. Solo aplica si hay destino.
   */
  target?: string;
  linkComponent?: any;
}>(), {
  as: 'div',
});

const isEditCanvas = inject(EDIT_CANVAS_KEY, false);

let router: any = null;
try {
  router = useRouter();
} catch (_) {}

const targetUrl = computed(() => props.to || props.href);
const isAction = computed(() => !targetUrl.value);

const isExternal = computed(() => {
  if (!targetUrl.value) return false;
  return /^(https?:)?\/\//i.test(targetUrl.value) || /^mailto:/i.test(targetUrl.value) || /^tel:/i.test(targetUrl.value);
});

// Determinar el componente de enlace
const linkTag = computed(() => {
  if (props.disabled || isAction.value) return props.as;

  // En el lienzo del editor, siempre ancla nativa para evitar que Vue Router
  // intente rutear rutas públicas inexistentes dentro del panel de administración
  if (isEditCanvas) return 'a';

  if (props.linkComponent) return props.linkComponent;

  // Enlaces externos siempre con <a> nativo
  if (isExternal.value) return 'a';

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

  // Si es un ancla HTML nativa o estamos en el editor de páginas
  if (linkTag.value === 'a' || isEditCanvas) {
    return { href: targetUrl.value, ...extra };
  }

  // Si es NuxtLink o RouterLink, pasamos solo 'to' (NuxtLink maneja enlaces externos e internos)
  return { to: targetUrl.value, ...extra };
});

const handleClick = (event: MouseEvent) => {
  if (isEditCanvas) {
    // En el lienzo del editor, previene la navegación para permitir la selección del bloque
    event.preventDefault();
    return;
  }

  // Si el componente cayó en ancla nativa 'a' pero la URL es interna y SPA:
  // prevenimos la recarga completa del navegador navegando vía enrutador
  if (
    typeof linkTag.value === 'string' &&
    linkTag.value === 'a' &&
    !isExternal.value &&
    targetUrl.value &&
    !props.target &&
    targetUrl.value !== '#' &&
    !targetUrl.value.startsWith('#')
  ) {
    if (router && typeof router.push === 'function') {
      event.preventDefault();
      router.push(targetUrl.value);
    }
  }
};
</script>

<template>
  <component :is="linkTag" v-bind="linkProps" @click="handleClick">
    <slot />
  </component>
</template>
