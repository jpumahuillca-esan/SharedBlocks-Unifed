<script setup lang="ts">
/**
 * AtomHeading — átomo de titular (ARCIS Design System).
 *
 * Único lugar donde se decide cómo se ve un h1-h6 en toda la librería.
 * Consume los tokens portados de webunificada (assets/styles/tokens.scss):
 * --text-display/giant/h1..h6 y --weight-*. Cambiar el diseño de un
 * titular se hace aquí una sola vez y se propaga a todo lo que use
 * este átomo, en vez de tocar cada bloque por separado.
 *
 * `level` decide la etiqueta semántica (h1..h6, importante para SEO/
 * accesibilidad). `size` decide el tamaño visual y por defecto coincide
 * con `level`, pero se puede desacoplar: p.ej. un <h1> de portada que
 * necesita verse con el tamaño "display" sin dejar de ser un h1 real.
 */
import { computed } from 'vue';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingSize = 'display' | 'giant' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type FontWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
type TextAlign = 'left' | 'center' | 'right';

const props = withDefaults(defineProps<{
  /** Etiqueta semántica a renderizar: 1 => <h1> ... 6 => <h6>. */
  level?: HeadingLevel;
  /** Tamaño visual (token --text-*). Por defecto, el mismo que `level`. */
  size?: HeadingSize;
  /** Peso de fuente (token --weight-*). Por defecto el del reset (semibold). */
  weight?: FontWeight;
  align?: TextAlign;
  /** Color CSS explícito (admite var(--arcis-color-...) o cualquier valor). */
  color?: string;
}>(), {
  level: 2,
});

const tag = computed(() => `h${props.level}`);

const styleObject = computed(() => ({
  fontSize: `var(--text-${props.size ?? `h${props.level}`})`,
  fontWeight: props.weight ? `var(--weight-${props.weight})` : undefined,
  textAlign: props.align,
  color: props.color,
}));
</script>

<template>
  <component :is="tag" class="atom-heading" :style="styleObject">
    <slot />
  </component>
</template>

<style scoped lang="scss">
.atom-heading {
  font-family: var(--font-display);
  line-height: 1.15;
  margin: 0;
}
</style>
