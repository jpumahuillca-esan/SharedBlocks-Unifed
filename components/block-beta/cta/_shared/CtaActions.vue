<template>
  <div v-if="hasAnyAction" class="ctaband__actions">
    <a
      v-if="primary.label"
      class="btn"
      :class="primaryClass"
      :href="primary.url || '#'"
    >
      {{ primary.label }}
    </a>

    <!-- El segundo botón existe solo si la variante está configurada con dos -->
    <a
      v-if="buttonCount === 2 && secondary.label"
      class="btn"
      :class="secondaryClass"
      :href="secondary.url || '#'"
    >
      {{ secondary.label }}
    </a>
  </div>
</template>

<script setup lang="ts">
/**
 * Área de acciones de un CTA Band.
 *
 * Las clases de cada botón se reciben desde la variante porque el kit usa
 * combinaciones distintas según el fondo: sobre el fondo oscuro de la variante
 * con imagen el secundario va en negativo, y sobre la sólida solo hay uno.
 */
import { computed } from 'vue';
import type { CtaAction, CtaButtonCount } from './types';

const props = withDefaults(
  defineProps<{
    primary: CtaAction;
    secondary: CtaAction;
    buttonCount: CtaButtonCount;
    primaryClass?: string;
    secondaryClass?: string;
  }>(),
  {
    primaryClass: 'btn--white',
    secondaryClass: 'btn--secondary btn--negative',
  },
);

/**
 * El contenedor desaparece si el CTA está configurado sin botones, o si no hay
 * ninguna etiqueta escrita: así no queda un hueco vacío bajo la descripción.
 */
const hasAnyAction = computed(() => {
  if (props.buttonCount === 0) return false;

  return Boolean(props.primary.label)
    || (props.buttonCount === 2 && Boolean(props.secondary.label));
});
</script>
