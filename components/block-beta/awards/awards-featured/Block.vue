<template>
  <!--
    Es una sección de tarjetas más: mismo encabezado, mismo carril con puntos y
    mismo enlace al pie que `events`. `awards` solo le ajusta a la fila lo que
    cambia al llevar logos en vez de tarjetas (ver _awards.scss).
  -->
  <section class="card-section awards">
    <CardSectionHeader
      :eyebrow="data.eyebrow ? `— ${data.eyebrow}` : ''"
      eyebrow-as="span"
      title-as="h2"
      :desc="data.desc || ''"
      :title="titleContent.text"
      :link-label="data.linkLabel || ''"
      :link-url="data.linkUrl || ''"
      :link-target="normalizeLinkTarget(data.linkTarget)"
    >
      <template #title>
        <span v-html="titleContent.html"></span>
      </template>
    </CardSectionHeader>

    <!--
      Las columnas son tantas como reconocimientos: con cuatro, cada logo se
      centra en su cuarto de ancho, como en la maqueta; con menos, se reparten
      el ancho en lugar de dejar un hueco a la derecha.
    -->
    <CardSlider v-if="awards.length" :count="awards.length" :columns="awards.length">
      <div v-for="(award, i) in awards" :key="award.id" class="awards__item" v-bind="edit(`awards.${i}`)">
        <!--
          Sin ancho ni alto en el <img>: cada logo lo sube el usuario y no se
          conocen sus medidas. El hueco lo reserva la casilla, que tiene alto
          fijo, así que la fila no salta mientras cargan.
        -->
        <img
          v-if="award.image"
          class="awards__logo"
          v-bind="edit('.image')"
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
        <span v-else class="awards__placeholder" aria-hidden="true" v-bind="edit('.image')"></span>
      </div>
    </CardSlider>

    <CardSectionFooter
      :link-label="data.linkLabel || ''"
      :link-url="data.linkUrl || ''"
      :link-target="normalizeLinkTarget(data.linkTarget)"
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
import { normalizeLinkTarget } from '../../../../helpers/linkTarget';
import { useEditTarget } from '../../../../core/editFocus';
const sanitizeTitleHtml = (value: unknown): { html: string; text: string } => {
  if (typeof value !== 'string' || !value) return { html: '', text: '' };

  if (typeof DOMParser === 'undefined') {
    const text = value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return { html, text };
  }

  const parsed = new DOMParser().parseFromString(value, 'text/html');
  const output = document.createElement('span');
  const allowedTags = new Set(['SPAN', 'STRONG', 'B', 'EM', 'I', 'U', 'S']);
  const blockedTags = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'SVG', 'MATH', 'TEMPLATE']);

  const copyNode = (source: Node, target: HTMLElement): void => {
    if (source.nodeType === Node.TEXT_NODE) {
      target.appendChild(document.createTextNode(source.textContent || ''));
      return;
    }

    if (!(source instanceof HTMLElement)) return;
    const tag = source.tagName;
    if (blockedTags.has(tag)) return;

    if (tag === 'BR') {
      target.appendChild(document.createElement('br'));
      return;
    }

    if (tag === 'P' || tag === 'DIV') {
      if (target.childNodes.length) target.appendChild(document.createElement('br'));
      source.childNodes.forEach((child) => copyNode(child, target));
      return;
    }

    if (allowedTags.has(tag)) {
      const clean = document.createElement(tag.toLowerCase());
      if (tag === 'SPAN') {
        const color = source.style.color.trim();
        if (color && typeof CSS !== 'undefined' && CSS.supports('color', color)) {
          clean.style.color = color;
        }
      }
      source.childNodes.forEach((child) => copyNode(child, clean));
      target.appendChild(clean);
      return;
    }

    source.childNodes.forEach((child) => copyNode(child, target));
  };

  parsed.body.childNodes.forEach((node) => copyNode(node, output));
  return {
    html: output.innerHTML.replace(/(?:<br>)+$/, ''),
    text: (output.textContent || '').replace(/\s+/g, ' ').trim(),
  };
};

/* Marcas para el enfoque de campos del constructor (core/editFocus.ts). */
const edit = useEditTarget();

/** Tope de la maqueta. El editor aplica el mismo (ver Editor.vue). */
const MAX_AWARDS = 4;

interface AwardItem {
  id: string;
  image: string;
  imageAlt: string;
}

const props = defineProps<{ data: any }>();

const titleContent = computed(() => sanitizeTitleHtml(props.data?.title));

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
