<script setup lang="ts">
/**
 * AtomText — átomo de párrafo/texto de cuerpo (ARCIS Design System).
 *
 * Único lugar donde se decide cómo se ve un <p> (o un texto en línea)
 * en toda la librería. Consume los tokens portados de webunificada
 * (assets/styles/tokens.scss): --text-body-lg/body/sm/xs, --weight-*
 * y --arcis-color-text-*.
 *
 * `as` permite renderizar como <p> (por defecto), <span>, etc. cuando
 * el texto va dentro de otro elemento de bloque y un <p> no es válido.
 */
import { computed } from 'vue';

type TextSize = 'body-lg' | 'body' | 'sm' | 'xs';
type FontWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
type TextAlign = 'left' | 'center' | 'right';
type TextColor = 'primary' | 'secondary' | 'disabled' | 'inverse';

const props = withDefaults(defineProps<{
  /** Etiqueta a renderizar. Por defecto <p>. */
  as?: string;
  /** Tamaño visual (token --text-*). */
  size?: TextSize;
  /** Peso de fuente (token --weight-*). Por defecto el del reset (regular). */
  weight?: FontWeight;
  align?: TextAlign;
  /** Color semántico (token --arcis-color-text-*). */
  color?: TextColor;
}>(), {
  as: 'p',
  size: 'body',
});

const styleObject = computed(() => ({
  fontSize: `var(--text-${props.size})`,
  fontWeight: props.weight ? `var(--weight-${props.weight})` : undefined,
  textAlign: props.align,
  color: props.color ? `var(--arcis-color-text-${props.color})` : undefined,
}));
</script>

<template>
  <component :is="as" class="atom-text" :style="styleObject">
    <slot />
  </component>
</template>

<style scoped lang="scss">
.atom-text {
  font-family: var(--font-body);
  margin: 0;
}
</style>
