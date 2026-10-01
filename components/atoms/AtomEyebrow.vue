<script setup lang="ts">
/**
 * AtomEyebrow — átomo de etiqueta corta sobre títulos de sección
 * (ARCIS Design System).
 *
 * Envuelve las clases .eyebrow/.eyebrow--neutral/.eyebrow--inverse
 * portadas en assets/styles/elements/_badges.scss (misma sección de
 * webunificada que Badge: "Badges & Eyebrow"). No redeclara estilos
 * propios.
 */
import { computed } from 'vue';

type EyebrowVariant = 'brand' | 'neutral' | 'inverse';

const props = withDefaults(defineProps<{
  /** "brand" (rojo institucional, por defecto), "neutral" (gris) o
   * "inverse" (blanco, para fondos de color/oscuros — ej. banner--brand). */
  variant?: EyebrowVariant;
  as?: string;
  /** Token institucional o valor CSS para texto y punto (ej: '--ds-color-univ-management') */
  colorToken?: string;
  /** Token institucional o valor CSS explícito para el texto (opcional) */
  textColorToken?: string;
  /** Token institucional o valor CSS explícito para el punto (opcional) */
  dotColorToken?: string;
}>(), {
  variant: 'brand',
  as: 'span',
});

const classes = computed(() => [
  'eyebrow',
  props.variant !== 'brand' ? `eyebrow--${props.variant}` : null,
]);

const styleObject = computed(() => {
  const styles: Record<string, string> = {};
  const effectiveText = props.textColorToken?.trim() || props.colorToken?.trim();
  const effectiveDot = props.dotColorToken?.trim() || props.colorToken?.trim();

  if (effectiveText) {
    styles['--eyebrow-text-color'] = effectiveText.startsWith('--') ? `var(${effectiveText})` : effectiveText;
  }
  if (effectiveDot) {
    styles['--eyebrow-dot-color'] = effectiveDot.startsWith('--') ? `var(${effectiveDot})` : effectiveDot;
  }
  return styles;
});
</script>

<template>
  <component :is="as" :class="classes" :style="styleObject">
    <slot />
  </component>
</template>
