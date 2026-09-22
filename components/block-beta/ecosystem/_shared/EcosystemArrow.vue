<template>
  <!--
    `white` es el principal en su versión para fondo oscuro (primary +
    negative), como lo nombra el Figma.
  -->
  <AtomButton
    :variant="variant === 'white' ? 'primary' : variant"
    :negative="variant === 'white'"
    size="sm"
    icon
    class="ecosystem-arrow"
    :href="href || undefined"
    :aria-label="`Ir a ${label}`"
  >
    <AtomIcon name="chevron-right" :size="16" />
  </AtomButton>
</template>

<script setup lang="ts">
/**
 * Flecha de una tarjeta o de la franja del ecosistema.
 *
 * Aparece siete veces en la sección, así que vive suelta en lugar de repetirse
 * en cada pieza.
 *
 * Es un AtomButton de solo ícono, no una pieza propia: el sistema ya resuelve
 * la forma cuadrada (`icon`), el tamaño (`sm`) y la accesibilidad del ancla sin
 * destino. Lo único que le faltaba era la variante para ir sobre color, y esa
 * se añadió al sistema —btn--surface— en vez de resolverse aquí.
 *
 * Dos acabados, como en la maqueta:
 *   surface  sobre el panel de color de una tarjeta, en blanco translúcido
 *   white    sobre la franja roja, en blanco sólido con el chevron en rojo
 *            (el principal del sistema en su versión `negative`)
 */
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';

withDefaults(
  defineProps<{
    href: string;
    /** Va al aria-label: la flecha es solo un ícono y no dice a dónde lleva. */
    label: string;
    variant?: 'surface' | 'white';
  }>(),
  { variant: 'surface' },
);
</script>
