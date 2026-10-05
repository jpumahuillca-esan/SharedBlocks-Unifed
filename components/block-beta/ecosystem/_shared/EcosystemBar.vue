<template>
  <div class="ecosystem-bar">
    <div class="ecosystem-bar__text">
      <AtomHeading :level="2" size="h5" weight="bold" class="ecosystem-bar__title" v-bind="edit('.title')">
        {{ title }}
      </AtomHeading>

      <AtomText v-if="desc" size="body-compact" class="ecosystem-bar__desc" v-bind="edit('.desc')">
        {{ desc }}
      </AtomText>
    </div>

    <!-- Sobre el rojo de la franja, la flecha va en blanco sólido. -->
    <EcosystemArrow :href="href" :target="target" :label="title" variant="white" v-bind="edit('.href')" />
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
import { useEditTarget } from '../../../../core/editFocus';

/* Marcas para el enfoque de campos del constructor (core/editFocus.ts). */
const edit = useEditTarget();

defineProps<{
  title: string;
  desc: string;
  href: string;
  /** `_blank` abre `href` en una pestaña nueva; vacío, en la misma página. */
  target?: string;
}>();
</script>
