<template>
  <div v-if="title || linkLabel" class="card-section__header">
    <h2 v-if="title" class="card-section__title">{{ title }}</h2>

    <a v-if="linkLabel" class="card-section__link" :href="linkUrl || '#'">
      {{ linkLabel }}
      <AtomIcon name="arrow-right" :size="16" />
    </a>
  </div>
</template>

<script setup lang="ts">
/**
 * Encabezado de una sección de tarjetas: título y enlace de "ver todos".
 *
 * Lo comparten las dos secciones. Cada parte desaparece si se deja vacía, así
 * que el encabezado completo se puede quitar sin tocar nada más.
 */
import AtomIcon from '../../../atoms/AtomIcon.vue';

defineProps<{
  title: string;
  linkLabel: string;
  linkUrl: string;
}>();
</script>
