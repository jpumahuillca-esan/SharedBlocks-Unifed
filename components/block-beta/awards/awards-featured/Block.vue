<template>
  <!--
    Es una sección de tarjetas más: mismo encabezado, mismo carril con puntos y
    mismo enlace al pie que `events`. `awards` solo le ajusta a la fila lo que
    cambia al llevar logos en vez de tarjetas (ver _awards.scss).
  -->
  <section class="card-section awards">
    <CardSectionHeader
      :desc="data.desc || ''"
      :title="data.title || ''"
      :link-label="data.linkLabel || ''"
      :link-url="data.linkUrl || ''"
    />

    <!--
      Las columnas son tantas como reconocimientos: con cuatro, cada logo se
      centra en su cuarto de ancho, como en la maqueta; con menos, se reparten
      el ancho en lugar de dejar un hueco a la derecha.
    -->
    <CardSlider v-if="awards.length" :count="awards.length" :columns="awards.length">
      <div v-for="award in awards" :key="award.id" class="awards__item">
        <!--
          Sin ancho ni alto en el <img>: cada logo lo sube el usuario y no se
          conocen sus medidas. El hueco lo reserva la casilla, que tiene alto
          fijo, así que la fila no salta mientras cargan.
        -->
        <img
          v-if="award.image"
          class="awards__logo"
          :src="award.image"
          :alt="award.imageAlt"
          loading="lazy"
          decoding="async"
        />

        <!--
          Sin imagen, la casilla no desaparece: queda un recuadro gris que marca
          dónde va el logo. Es puro adorno, por eso es un <span> oculto a los
          lectores de pantalla.
        -->
        <span v-else class="awards__placeholder" aria-hidden="true"></span>
      </div>
    </CardSlider>

    <CardSectionFooter
      :link-label="data.linkLabel || ''"
      :link-url="data.linkUrl || ''"
    />
  </section>
</template>

<script setup lang="ts">
/**
 * Reconocimientos destacados.
 *
 * Encabezado con título, filete y descripción, el enlace de "ver más" y una
 * fila de hasta cuatro logos de rankings y acreditaciones. El contenido se
 * escribe desde el editor; no consulta ninguna API.
 *
 * No inventa piezas: el encabezado, el pie y el carril con puntos son los de la
 * familia `events`. En escritorio los cuatro logos caben y no hay puntos; en
 * teléfono se ven dos y el resto se alcanza deslizando o con los puntos.
 *
 * Un reconocimiento sin imagen conserva su casilla, pintada de gris, igual que
 * el hueco de la foto en las tarjetas de eventos y publicaciones: así el bloque
 * recién insertado ya muestra dónde va cada logo, y la fila no cambia de
 * reparto al ir subiéndolos.
 */
import { computed } from 'vue';
/*
 * Encabezado, pie y carril vienen de `events`, igual que el acordeón que ya
 * usan `testimonials`, `hero` e `info`. Conviene subirlos a block-beta/_shared/
 * en un cambio aparte que toque a todas las familias a la vez.
 */
import CardSectionHeader from '../../events/_shared/CardSectionHeader.vue';
import CardSectionFooter from '../../events/_shared/CardSectionFooter.vue';
import CardSlider from '../../events/_shared/CardSlider.vue';

/** Tope de la maqueta. El editor aplica el mismo (ver Editor.vue). */
const MAX_AWARDS = 4;

interface AwardItem {
  id: string;
  image: string;
  imageAlt: string;
}

const props = defineProps<{ data: any }>();

const awards = computed<AwardItem[]>(() => {
  const raw = Array.isArray(props.data?.awards) ? props.data.awards : [];

  return raw.slice(0, MAX_AWARDS).map((award: any, i: number) => ({
    id: award?.id || `award-${i}`,
    // Una ruta con solo espacios cuenta como vacía: si no, saldría un logo roto.
    image: typeof award?.image === 'string' ? award.image.trim() : '',
    imageAlt: award?.imageAlt ?? '',
  }));
});
</script>
