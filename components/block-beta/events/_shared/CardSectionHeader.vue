<template>
  <div v-if="title || desc || linkLabel" class="card-section__header">
    <!--
      Título, guion y descripción van juntos en su propia columna: así el enlace
      de la derecha se alinea con el pie del bloque y no queda flotando entre
      líneas.
    -->
    <div v-if="title || desc" class="card-section__heading">
      <h2 v-if="title" class="card-section__title">{{ title }}</h2>

      <!-- Guion rojo bajo el título. Adorno: acompaña siempre al título. -->
      <span v-if="title" class="card-section__rule" aria-hidden="true"></span>

      <!-- Opcional. -->
      <AtomText v-if="desc" size="sm" class="card-section__desc">{{ desc }}</AtomText>
    </div>

    <a v-if="linkLabel" class="card-section__link" :href="linkUrl || '#'">
      {{ linkLabel }}
      <AtomIcon name="arrow-right" :size="16" />
    </a>
  </div>
</template>

<script setup lang="ts">
/**
 * Encabezado de una sección de tarjetas: título con su guion rojo debajo,
 * descripción opcional y enlace de "ver todos".
 *
 * Lo comparten las dos secciones. Cada parte desaparece si se deja vacía, así
 * que el encabezado completo se puede quitar sin tocar nada más.
 */
import AtomText from '../../../atoms/AtomText.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';

defineProps<{
  title: string;
  /** Opcional. */
  desc: string;
  linkLabel: string;
  linkUrl: string;
}>();
</script>
