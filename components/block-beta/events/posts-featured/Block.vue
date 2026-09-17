<template>
  <section class="card-section">
    <CardSectionHeader
      :desc="data.desc || ''"
      :title="data.title || ''"
      :link-label="data.linkLabel || ''"
      :link-url="data.linkUrl || ''"
    />

    <CardSlider :count="visibleCards.length" :columns="cardCount">
      <!-- Siempre el formato de noticia: es el diseño de esta sección. -->
      <MoleculePostCard
        v-for="card in visibleCards"
        :key="card.id"
        variant="news"
        :image="card.image"
        :image-alt="card.imageAlt"
        :date="card.date"
        :title="card.title"
        :cta-label="card.ctaLabel || undefined"
        :href="card.href"
        :badges="card.badges"
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
 * Sección de publicaciones destacadas.
 *
 * Misma arquitectura que la de eventos: fila de tarjetas con encabezado y
 * enlace de "ver todos", contenido escrito desde el editor.
 */
import { computed } from 'vue';
import MoleculePostCard from '../../../molecules/MoleculePostCard.vue';
import CardSectionHeader from '../_shared/CardSectionHeader.vue';
import CardSectionFooter from '../_shared/CardSectionFooter.vue';
import CardSlider from '../_shared/CardSlider.vue';
import { normalizeCardCount, type PostCardItem } from '../_shared/types';
import { toDisplayDate } from '../_shared/date';

const props = defineProps<{ data: any }>();

const cardCount = computed(() => normalizeCardCount(props.data?.cardCount));

const visibleCards = computed<PostCardItem[]>(() => {
  const raw = Array.isArray(props.data?.cards) ? props.data.cards : [];

  // Se muestran todas: el número elegido en el editor decide cuántas se ven a
  // la vez, no cuántas existen. El resto queda al alcance del carrusel.
  return raw.map((card: any, i: number) => ({
    id: card?.id || `post-${i}`,
    image: card?.image ?? '',
    imageAlt: card?.imageAlt ?? '',
    title: card?.title ?? '',
    href: card?.href ?? '',
    /*
     * Una fecha ISO del calendario se presenta como día/mes/año. Cualquier otra
     * cosa se pasa tal cual: es contenido escrito a mano antes del calendario.
     */
    date: toDisplayDate(card?.date ?? '') ?? card?.date ?? '',
    ctaLabel: card?.ctaLabel ?? '',
    badges: Array.isArray(card?.badges)
      ? card.badges.filter((b: any) => typeof b === 'string' && b.trim())
      : [],
  })) as PostCardItem[];
});
</script>
