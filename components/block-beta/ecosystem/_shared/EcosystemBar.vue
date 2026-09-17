<template>
  <div class="ecosystem-bar">
    <div class="ecosystem-bar__text">
      <AtomHeading :level="3" size="h5" weight="bold" class="ecosystem-bar__title">
        {{ title }}
      </AtomHeading>

      <AtomText v-if="desc" size="sm" class="ecosystem-bar__desc">
        {{ desc }}
      </AtomText>
    </div>

    <!-- Sobre el rojo de la franja, la flecha va en blanco sólido. -->
    <EcosystemArrow :href="href" :label="title" variant="white" />
  </div>
</template>

<script setup lang="ts">
/**
 * Franja de encabezado del grupo de facultades.
 *
 * Es la única pieza de la sección cuyo color no se elige: siempre va en el rojo
 * institucional, porque encabeza el conjunto en lugar de representar a una
 * escuela concreta.
 */
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import EcosystemArrow from './EcosystemArrow.vue';

defineProps<{
  title: string;
  desc: string;
  href: string;
}>();
</script>
