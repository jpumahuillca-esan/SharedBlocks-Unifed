<template>
  <div v-if="linkLabel" class="card-section__footer">
    <AtomButton variant="link" size="sm" class="card-section__link" :href="linkUrl || '#'" :target="linkTarget" v-bind="edit('linkLabel')">
      {{ linkLabel }}
      <AtomIcon name="arrow-right" :size="16" />
    </AtomButton>
  </div>
</template>

<script setup lang="ts">
/**
 * Enlace de "ver todos" al pie de la sección.
 *
 * Es el mismo enlace del encabezado, repetido aquí. En escritorio este pie
 * está oculto y el del encabezado visible; en móvil ocurre lo contrario, donde
 * el enlace queda mejor debajo de la fila de tarjetas.
 *
 * Se duplica el marcado en lugar de moverlo con JavaScript porque el cambio lo
 * decide una consulta de medios, no el estado del componente.
 */
import AtomButton from '../../../atoms/AtomButton.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import { useEditTarget } from '../../../../core/editFocus';

/* Marcas para el enfoque de campos del constructor (core/editFocus.ts). */
const edit = useEditTarget();

defineProps<{
  linkLabel: string;
  linkUrl: string;
  /** `_blank` abre el enlace en una pestaña nueva; vacío, en la misma página. */
  linkTarget?: string;
}>();
</script>
