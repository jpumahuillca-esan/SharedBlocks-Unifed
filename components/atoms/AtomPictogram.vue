<script setup lang="ts">
/**
 * AtomPictogram — pictograma de marca (ARCIS Design System).
 *
 * Dibuja por nombre uno de los pictogramas de helpers/pictograms.ts, igual que
 * AtomIcon dibuja por nombre un ícono de Lucide. Son dos átomos hermanos y no
 * uno solo a propósito: AtomIcon resuelve componentes de trazo para controles
 * de interfaz (tamaño, grosor de línea) y este inserta ilustraciones rellenas
 * de la marca. Unirlos obligaría a AtomIcon a aceptar props que para Lucide no
 * significan nada.
 *
 * Envuelve la clase .pictogram de assets/styles/elements/_pictograms.scss. No
 * declara estilos propios.
 *
 * v-html es seguro aquí: el marcado nunca viene del contenido guardado, solo
 * del catálogo, que son archivos del repositorio. Del contenido llega el
 * NOMBRE, y un nombre desconocido no dibuja nada.
 */
import { computed } from 'vue';
import { getPictogramSvg } from '../../helpers/pictograms';

const props = withDefaults(defineProps<{
  /** Clave del catálogo, ej. "airplane". Vacío = sin pictograma. */
  name: string;
  /** Lado en px. Los dibujos están trazados sobre 40. */
  size?: number;
  /** Por defecto el rojo de marca (lo pone la hoja, no este átomo). */
  color?: string;
  /**
   * Solo si el dibujo dice algo que el texto de al lado no dice. Sin esto el
   * pictograma es decorativo y se oculta a lectores de pantalla.
   */
  label?: string;
}>(), {
  size: 40,
});

const svg = computed(() => getPictogramSvg(props.name));

if (import.meta.env?.DEV && props.name && !svg.value) {
  // eslint-disable-next-line no-console
  console.warn(
    `[AtomPictogram] "${props.name}" no está en PICTOGRAMS de helpers/pictograms.ts. ` +
    `Agrégalo ahí (import ?raw + entrada) antes de usarlo.`
  );
}

const styleObject = computed(() => ({
  '--pictogram-size': `${props.size}px`,
  color: props.color,
}));
</script>

<template>
  <span
    v-if="svg"
    class="pictogram"
    :style="styleObject"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    v-html="svg"
  ></span>
</template>
