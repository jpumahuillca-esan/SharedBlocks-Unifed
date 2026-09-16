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
 *
 * `as` lleva ese desacople hasta el final: renderiza una etiqueta que NO
 * es un titular conservando el aspecto de uno. Existe para el caso de un
 * texto que se ve como título pero no debe serlo — por ejemplo, las
 * diapositivas de un carrusel de portada: la primera es el <h1> de la
 * página y las siguientes tienen que ser párrafos, porque un documento no
 * puede tener cinco <h1>. Sin esto habría que escribir el <p> a mano y
 * duplicar los tamaños fuera del átomo, que es justo lo que este evita.
 */
import { computed } from 'vue';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
/*
 * Los tamaños de texto (body-lg, body, sm, xs) están aquí a propósito: hay
 * titulares que semánticamente son un h3 pero se ven al tamaño del texto
 * corrido, como el título de una tarjeta. Sin ellos, el tamaño más pequeño
 * posible era h6 (18px), y la única salida era pedir un "h7" que no existe: el
 * navegador descarta var(--text-h7) y el título hereda el tamaño del padre por
 * accidente. Cada nombre se traduce a su token --text-*, que sí existe.
 */
type HeadingSize =
  | 'display' | 'giant'
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'body-lg' | 'body' | 'sm' | 'xs';
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
  /**
   * Etiqueta a renderizar en lugar del titular, ej. 'p'.
   *
   * Sin esto se usa `level` y sale un h1..h6, que es el comportamiento
   * normal. Con esto el elemento deja de ser un titular pero conserva
   * tamaño, familia y peso.
   */
  as?: string;
}>(), {
  level: 2,
});

const tag = computed(() => props.as ?? `h${props.level}`);

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
