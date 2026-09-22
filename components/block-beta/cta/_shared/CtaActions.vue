<template>
  <div v-if="hasAnyAction" class="ctaband__actions">
    <AtomButton
      v-if="primary.label"
      variant="primary"
      :negative="negative"
      :href="primary.url || '#'"
    >
      {{ primary.label }}
    </AtomButton>

    <!-- El segundo botón existe solo si la variante está configurada con dos -->
    <AtomButton
      v-if="buttonCount === 2 && secondary.label"
      variant="secondary"
      :negative="negative"
      :href="secondary.url || '#'"
    >
      {{ secondary.label }}
    </AtomButton>
  </div>
</template>

<script setup lang="ts">
/**
 * Área de acciones de un CTA Band: el botón principal y, si la variante lleva
 * dos, el secundario.
 *
 * Son AtomButton, no clases .btn escritas a mano: su aspecto y sus estados
 * (hover, pressed, deshabilitado) los pone el sistema.
 *
 * Todas las bandas van sobre un fondo de color o una foto oscurecida, así que
 * por defecto usan la versión para fondo oscuro del Figma: el principal blanco
 * con texto rojo y el secundario en contorno blanco. Una banda clara pasaría
 * `:negative="false"`.
 */
import { computed } from 'vue';
import AtomButton from '../../../atoms/AtomButton.vue';
import type { CtaAction, CtaButtonCount } from './types';

const props = withDefaults(
  defineProps<{
    primary: CtaAction;
    secondary: CtaAction;
    buttonCount: CtaButtonCount;
    /** Versión para fondo oscuro. */
    negative?: boolean;
  }>(),
  { negative: true },
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
