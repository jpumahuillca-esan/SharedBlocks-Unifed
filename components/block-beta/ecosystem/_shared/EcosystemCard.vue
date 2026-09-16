<template>
  <article
    class="ecosystem-card"
    :class="[`ecosystem-card--${variant}`, `ecosystem-card--${card.color}`]"
  >
    <div class="ecosystem-card__media">
      <!-- Sin imagen no se emite <img>: un src vacío da un icono roto. -->
      <img v-if="card.image" :src="card.image" :alt="card.imageAlt || ''" loading="lazy" />
    </div>

    <div class="ecosystem-card__body">
      <div class="ecosystem-card__text">
        <!--
          size="body" (16px): el título al tamaño del texto corrido. Antes estaba
          en "h7", que no existe: el navegador descartaba var(--text-h7) y el
          título heredaba 16px por accidente. Mismo resultado, ahora a propósito.
        -->
        <AtomHeading :level="3" size="body" weight="bold" class="ecosystem-card__title">
          {{ card.title }}
        </AtomHeading>

        <AtomText v-if="card.desc" size="xs" class="ecosystem-card__desc">
          {{ card.desc }}
        </AtomText>
      </div>

      <EcosystemArrow :href="card.href" :label="card.title" />
    </div>
  </article>
</template>

<script setup lang="ts">
/**
 * Una tarjeta del ecosistema: foto arriba y panel de color debajo con el
 * título, la descripción y la flecha.
 *
 * Las dos grandes de la izquierda y las de facultad de la derecha comparten
 * esta misma anatomía, así que comparten componente. Lo que cambia entre ellas
 * es la proporción y, en tableta, la composición — eso lo resuelve el
 * modificador de variante en la hoja de estilos, no marcado distinto.
 *
 * El color nunca llega como valor: llega como nombre y la hoja lo traduce al
 * token que corresponde. Ver el comentario de EcosystemColor en types.ts.
 */
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import EcosystemArrow from './EcosystemArrow.vue';
import type { EcosystemCardItem } from './types';

defineProps<{
  card: EcosystemCardItem;
  /** 'feature' son las dos grandes; 'faculty', las del grupo de la derecha. */
  variant: 'feature' | 'faculty';
}>();
</script>
