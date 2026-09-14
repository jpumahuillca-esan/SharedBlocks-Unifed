<template>
  <section class="card-section">
    <CardSectionHeader
      :title="data.title || ''"
      :link-label="data.linkLabel || ''"
      :link-url="data.linkUrl || ''"
    />

    <CardSlider :count="visibleCards.length" :columns="cardCount">
      <MoleculeEventCard
        v-for="card in visibleCards"
        :key="card.id"
        :variant="card.variant"
        :day="card.day"
        :month="card.month"
        :title="card.title"
        :href="card.href"
        :time="card.time"
        :location="card.location"
        :cta-label="card.ctaLabel"
        :image="card.image"
        :image-alt="card.imageAlt"
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
 * Sección de eventos destacados.
 *
 * Fila de tarjetas de evento con encabezado y enlace de "ver todos". El
 * contenido se escribe desde el editor; no consulta ninguna API.
 *
 * La sección solo dibuja las primeras tarjetas según el número elegido: las que
 * sobran se conservan en el dato por si se sube ese número más adelante.
 */
import { computed } from 'vue';
import MoleculeEventCard from '../../../molecules/MoleculeEventCard.vue';
import CardSectionHeader from '../_shared/CardSectionHeader.vue';
import CardSectionFooter from '../_shared/CardSectionFooter.vue';
import CardSlider from '../_shared/CardSlider.vue';
import { normalizeCardCount, type EventCardItem } from '../_shared/types';
import { toEventDateParts } from '../_shared/date';

const props = defineProps<{ data: any }>();

const cardCount = computed(() => normalizeCardCount(props.data?.cardCount));

const visibleCards = computed<EventCardItem[]>(() => {
  const raw = Array.isArray(props.data?.cards) ? props.data.cards : [];

  // Se muestran todas: el número elegido en el editor decide cuántas se ven a
  // la vez, no cuántas existen. El resto queda al alcance del carrusel.
  return raw.map((card: any, i: number) => {
    /*
     * La fecha elegida en el calendario manda. Si no hay ninguna, se respetan
     * el día y el mes escritos a mano, que es como se guardaban antes.
     */
    const fromCalendar = toEventDateParts(card?.date ?? '');

    return {
    id: card?.id || `event-${i}`,
    variant: card?.variant === 'media' ? 'media' : 'standard',
    date: card?.date ?? '',
    day: fromCalendar?.day ?? card?.day ?? '',
    month: fromCalendar?.month ?? card?.month ?? '',
    title: card?.title ?? '',
    href: card?.href ?? '',
    time: card?.time ?? '',
    location: card?.location ?? '',
    ctaLabel: card?.ctaLabel ?? '',
    image: card?.image ?? '',
    imageAlt: card?.imageAlt ?? '',
    tag: card?.tag ?? '',
    badges: Array.isArray(card?.badges)
      ? card.badges.filter((b: any) => typeof b === 'string' && b.trim())
      : [],
    };
  }) as EventCardItem[];
});
</script>
