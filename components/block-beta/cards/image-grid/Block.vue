<template>
  <!--
    Es una sección de tarjetas más: mismo encabezado, mismo carril con puntos y
    mismo enlace al pie que `events` y `awards`. Lo propio de este bloque —la
    rejilla de varias filas en escritorio y tableta, y el carrusel de una en una
    solo en teléfono— lo resuelve _image-grid.scss.
  -->
  <section class="card-section image-grid">
    <CardSectionHeader
      :eyebrow="data.eyebrow || ''"
      :title="data.title || ''"
      :desc="data.desc || ''"
      :link-label="data.linkLabel || ''"
      :link-url="data.linkUrl || ''"
    />

    <!--
      Los puntos los decide CardSlider midiendo el desbordamiento real: en la
      rejilla todas las tarjetas caben y no aparecen; en el carrusel del
      teléfono, sí.
    -->
    <CardSlider v-if="cards.length" :count="cards.length" :columns="COLUMNS">
      <!--
        Cada tarjeta es MoleculeBanner en su forma "image", que ya es esta pieza
        tal cual: foto a sangre, degradado, título, texto y la flecha roja fija.
        Toda la tarjeta es el enlace.

        Es un h3 porque la sección ya tiene su h2. El tamaño y el del texto se
        piden aquí porque los átomos los fijan en línea y la hoja no los alcanza.
      -->
      <MoleculeBanner
        v-for="card in cards"
        :key="card.id"
        variant="image"
        class="image-grid__card"
        :image="card.image"
        :image-alt="card.imageAlt"
        :title="card.title"
        :title-level="3"
        title-size="h5"
        :text="card.desc"
        text-size="sm"
        :href="card.href"
      />
    </CardSlider>

    <CardSectionFooter
      :link-label="data.linkLabel || ''"
      :link-url="data.linkUrl || ''"
    />
  </section>
</template>

<script setup lang="ts">
/**
 * Rejilla de tarjetas con imagen.
 *
 * Encabezado con etiqueta, título y filete, y debajo las tarjetas: cada una una
 * foto con su título, una línea de apoyo y la flecha que lleva a su página. El
 * contenido se escribe desde el editor; no consulta ninguna API.
 *
 * Tres composiciones:
 *   escritorio  tres por fila, en tantas filas como haga falta
 *   tableta     dos por fila
 *   teléfono    una sola fila que se desliza de a una, con puntos
 *
 * No inventa piezas: la tarjeta es MoleculeBanner, y el encabezado, el pie y el
 * carril con puntos son los de `events`.
 */
import { computed } from 'vue';
import MoleculeBanner from '../../../molecules/MoleculeBanner.vue';
/*
 * Encabezado, pie y carril vienen de `events`, como en `awards`. Conviene
 * subirlos a block-beta/_shared/ en un cambio aparte que toque a todas las
 * familias a la vez.
 */
import CardSectionHeader from '../../events/_shared/CardSectionHeader.vue';
import CardSectionFooter from '../../events/_shared/CardSectionFooter.vue';
import CardSlider from '../../events/_shared/CardSlider.vue';

/** Tarjetas por fila en escritorio. La hoja la lee de CardSlider. */
const COLUMNS = 3;

interface ImageGridCard {
  id: string;
  image: string;
  imageAlt: string;
  title: string;
  desc: string;
  href: string;
}

const props = defineProps<{ data: any }>();

const cards = computed<ImageGridCard[]>(() => {
  const raw = Array.isArray(props.data?.cards) ? props.data.cards : [];

  return raw.map((card: any, i: number) => ({
    id: card?.id || `ig-${i}`,
    // Una ruta con solo espacios cuenta como vacía: si no, saldría una foto rota.
    image: typeof card?.image === 'string' ? card.image.trim() : '',
    imageAlt: card?.imageAlt ?? '',
    title: card?.title ?? '',
    desc: card?.desc ?? '',
    href: card?.href ?? '',
  }));
});
</script>
