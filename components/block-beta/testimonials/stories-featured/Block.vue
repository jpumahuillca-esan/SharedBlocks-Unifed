<template>
  <section class="story-section">
    <!--
      La franja de color es una capa aparte y no el fondo de la sección: en el
      diseño termina DENTRO de la tarjeta, de modo que la mitad inferior de las
      tarjetas queda sobresaliendo sobre el fondo de la página.
    -->
    <span class="story-section__band" aria-hidden="true"></span>

    <div class="story-section__inner">
      <StorySectionHeader
        :title="data.title || ''"
        :subtitle="data.subtitle || ''"
        :link-label="data.linkLabel || ''"
        :link-url="data.linkUrl || ''"
      />

      <!--
        El carril es un simple desbordamiento horizontal: sin puntos y sin
        flechas, tal como pide el diseño. Se desliza para alcanzar las tarjetas
        que quedan fuera de la vista.

        useDragScroll añade lo único que el desbordamiento no cubre: con un
        ratón no hay gesto horizontal, así que el carril se arrastra.
      -->
      <div
        ref="rail"
        class="story-section__rail"
        :style="{ '--story-section-columns': String(cardCount) }"
      >
        <MoleculeTestimonial
          v-for="card in cards"
          :key="card.id"
          variant="video"
          :author-name="card.name"
          :author-role="card.role"
          :image="card.image"
          :image-alt="card.imageAlt"
          :video-url="card.videoUrl"
          :href="card.href"
          :cta-label="card.ctaLabel"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Sección de historias destacadas.
 *
 * Fila de testimonios en video sobre la franja de color de marca. El contenido
 * se escribe desde el editor; no consulta ninguna API.
 *
 * La tarjeta no es propia: es MoleculeTestimonial en su forma "video", que ya
 * existía en el sistema con exactamente esta anatomía (foto vertical a sangre,
 * botón de play, y overlay con nombre, filete, cargo y enlace). Este bloque
 * aporta solo lo que faltaba alrededor: la franja, el encabezado y el carril.
 *
 * Igual que en `events`, el número elegido en el editor decide cuántas tarjetas
 * se ven A LA VEZ, no cuántas existen: las demás siguen ahí, al alcance del
 * carril.
 */
import { ref, computed } from 'vue';
import MoleculeTestimonial from '../../../molecules/MoleculeTestimonial.vue';
import StorySectionHeader from '../_shared/StorySectionHeader.vue';
import { useDragScroll } from '../../../../composables/useDragScroll';
import { normalizeStoryCardCount, type StoryCardItem } from '../_shared/types';

const props = defineProps<{ data: any }>();

/*
 * Con trackpad o pantalla táctil el carril ya se desplaza solo; con un ratón no
 * hay gesto horizontal, así que se puede arrastrar.
 */
const rail = ref<HTMLElement | null>(null);
useDragScroll(rail);

const cardCount = computed(() => normalizeStoryCardCount(props.data?.cardCount));

const cards = computed<StoryCardItem[]>(() => {
  const raw = Array.isArray(props.data?.cards) ? props.data.cards : [];

  return raw.map((card: any, i: number) => ({
    id: card?.id || `story-${i}`,
    name: card?.name ?? '',
    role: card?.role ?? '',
    image: card?.image ?? '',
    imageAlt: card?.imageAlt ?? '',
    videoUrl: card?.videoUrl ?? '',
    href: card?.href ?? '',
    ctaLabel: card?.ctaLabel ?? '',
  })) as StoryCardItem[];
});
</script>
