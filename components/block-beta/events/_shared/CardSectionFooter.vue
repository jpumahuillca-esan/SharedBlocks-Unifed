<template>
  <div v-if="linkLabel" class="card-section__footer">
    <a class="card-section__link" :href="linkUrl || '#'">
      {{ linkLabel }}
      <AtomIcon name="arrow-right" :size="16" />
    </a>
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
import AtomIcon from '../../../atoms/AtomIcon.vue';

defineProps<{
  linkLabel: string;
  linkUrl: string;
}>();
</script>
