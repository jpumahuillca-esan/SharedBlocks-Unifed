<template>
  <article
    class="ecosystem-card"
    :class="[`ecosystem-card--${variant}`, `ecosystem-card--${card.color}`]"
  >
    <div class="ecosystem-card__media" v-bind="edit('.image')">
      <!-- Sin imagen no se emite <img>: un src vacío da un icono roto. -->
      <img
        v-if="card.image"
        :src="card.image"
        :alt="card.imageAlt || ''"
        :style="imageFocusStyle(card.imageFocusX, card.imageFocusY)"
        loading="lazy"
      />
    </div>

    <div class="ecosystem-card__body">
      <div class="ecosystem-card__text">
        <!--
          Con destino, el título es el enlace de la tarjeta y se extiende sobre
          toda ella (.ecosystem-card__link): cualquier punto lleva al mismo sitio
          que la flecha. Sin destino queda como texto y nada es clicable.
        -->
        <AtomHeading :level="titleLevel" :size="sizes.title" weight="bold" class="ecosystem-card__title" v-bind="edit('.title')">
          <AtomLink v-if="card.href" :href="card.href" :target="card.target" class="ecosystem-card__link">{{ card.title }}</AtomLink>
          <template v-else>{{ card.title }}</template>
        </AtomHeading>

        <AtomText v-if="card.desc" :size="sizes.desc" class="ecosystem-card__desc" v-bind="edit('.desc')">
          {{ card.desc }}
        </AtomText>
      </div>

      <!--
        Con el título como enlace, la flecha repite el mismo destino: se saca del
        orden de tabulación y de los lectores de pantalla para que la tarjeta sea
        una sola parada y no se anuncie dos veces. Sigue siendo un <a> pulsable.
      -->
      <EcosystemArrow :href="card.href" :target="card.target" :label="card.title" :decorative="!!card.href" v-bind="edit('.href')" />
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
import { computed } from 'vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomLink from '../../../atoms/AtomLink.vue';
import EcosystemArrow from './EcosystemArrow.vue';
import { imageFocusStyle } from '../../../../helpers/imageFocus';
import type { EcosystemCardItem, EcosystemTitleLevel } from './types';
import { useEditTarget } from '../../../../core/editFocus';

/* Marcas para el enfoque de campos del constructor (core/editFocus.ts). */
const edit = useEditTarget();

const props = defineProps<{
  card: EcosystemCardItem;
  /** 'feature' son las dos grandes; 'faculty', las del grupo de la derecha. */
  variant: 'feature' | 'faculty';
  /** Etiqueta del título (h2, h3 o h4). No cambia el tamaño: ese va por variante. */
  titleLevel: EcosystemTitleLevel;
}>();

/*
 * El tamaño de letra SÍ depende de la variante, y se decide aquí y no en la
 * hoja: los átomos lo aplican como estilo en línea, que ninguna regla de la
 * hoja puede pisar.
 *
 * Las escuelas grandes van un escalón por encima (18px / 14px): su panel es
 * bastante más ancho, y a 16px / 12px el texto se veía perdido en él. Las de
 * facultad se quedan al tamaño del texto corrido (16px / 12px).
 */
const sizes = computed(() =>
  props.variant === 'feature'
    ? { title: 'h6', desc: 'body-compact' } as const
    : { title: 'body', desc: 'body-sm' } as const,
);
</script>
