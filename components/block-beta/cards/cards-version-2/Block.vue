<template>
  <section
    :id="customId || 'carreras'"
    :data-section-id="customId || undefined"
    class="cards-v2-section"
    v-bind="edit('backgroundColor')"
    :class="{
      'cards-v2-section--white': (data?.backgroundColor || normalized.backgroundColor) === '#FFFFFF',
      'cards-v2-section--list': isListLayout,
    }"
    :style="{ backgroundColor: data?.backgroundColor || normalized.backgroundColor || '#F1F5F9' }"
  >
    <span v-if="anchorId" :id="anchorId" class="cards-v2__anchor" aria-hidden="true"></span>
    <div class="cards-v2__container">
      <!-- Encabezado construido con átomos ARCIS -->
      <header v-if="data.eyebrow || data.title || data.desc" class="cards-v2__header">
        <AtomEyebrow
          v-if="data.eyebrow"
          :color-token="data.eyebrowColorToken"
          v-bind="edit('eyebrow')"
        >
          {{ data.eyebrow }}
        </AtomEyebrow>

        <AtomHeading
          v-if="data.title"
          :level="2"
          size="h2"
          weight="bold"
          class="cards-v2__title"
          v-bind="edit('title')"
        >
          {{ data.title }}
        </AtomHeading>

        <!-- Guion rojo bajo el título -->
        <span v-if="data.title" class="cards-v2__rule" aria-hidden="true"></span>

        <!-- Descripción opcional con AtomText -->
        <AtomText
          v-if="data.desc"
          size="body"
          color="secondary"
          class="cards-v2__desc"
          v-bind="edit('desc')"
        >
          {{ data.desc }}
        </AtomText>
      </header>

      <!-- Rejilla o Lista de tarjetas -->
      <div v-if="cards.length" class="cards-v2__grid" :class="{ 'cards-v2__grid--list': isListLayout }">
        <AtomLink
          v-for="(card, i) in cards"
          v-bind="edit(`cards.${i}`)"
          :key="card.id"
          :href="card.href || undefined"
          :target="card.target"
          as="div"
          class="cards-v2__card"
        >
          <!-- Ícono izquierdo en recuadro suave con AtomIcon -->
          <span class="cards-v2__icon-box" aria-hidden="true" v-bind="edit('.icon')">
            <AtomIcon :name="card.icon || 'graduation-cap'" :size="22" />
          </span>

          <!-- Contenido central: Título con AtomHeading -->
          <div class="cards-v2__content">
            <AtomHeading
              :level="3"
              size="body"
              weight="semibold"
              class="cards-v2__card-title"
              v-bind="edit('.title')"
            >
              {{ card.title }}
            </AtomHeading>

            <!-- Si no es list layout o en móvil pequeño -->
            <AtomText
              v-if="card.desc && !isListLayout"
              size="body-sm"
              color="secondary"
              class="cards-v2__card-desc"
              v-bind="edit('.desc')"
            >
              {{ card.desc }}
            </AtomText>
          </div>

          <!-- Columna Grado en modo lista -->
          <div v-if="isListLayout && card.desc" class="cards-v2__degree" v-bind="edit('.desc')">
            <span class="cards-v2__degree-label">Grado:</span>
            <span class="cards-v2__degree-value">{{ card.desc }}</span>
          </div>

          <!-- Botón "Ver carrera" en modo lista o Flecha en modo compacto -->
          <div v-if="isListLayout" class="cards-v2__btn-wrap">
            <span class="cards-v2__btn">Ver carrera</span>
          </div>
          <span v-else class="cards-v2__arrow" aria-hidden="true" v-bind="edit('.href')">
            <AtomIcon name="chevron-right" :size="18" />
          </span>
        </AtomLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Bloque Cards Version 2 (ARCIS Design System).
 *
 * Reutiliza los átomos oficiales de la librería compartida:
 * - AtomEyebrow: Etiqueta superior del encabezado
 * - AtomHeading: Título de la sección (h2) y títulos de las tarjetas (h3 semántico con tamaño body)
 * - AtomText: Descripción de sección y descripciones secundarias de las tarjetas
 * - AtomIcon: Íconos temáticos y chevrons del sistema de diseño (Lucide)
 *
 * Modos de disposición:
 * - Grid: 3 columnas en escritorio, 2 en tableta, 1 en móvil.
 * - List: Fila horizontal por tarjeta (860px) con icono, título, grado y botón "Ver carrera".
 */
import { computed, useAttrs } from 'vue';
import AtomEyebrow from '../../../atoms/AtomEyebrow.vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import AtomLink from '../../../atoms/AtomLink.vue';
import { buildCardsVersion2Data, type CardVersion2Item } from './types';
import { useEditTarget } from '../../../../core/editFocus';

/* Marcas para el enfoque de campos del constructor (core/editFocus.ts). */
const edit = useEditTarget();
const attrs = useAttrs();

const props = defineProps<{
  data: any;
}>();

const customId = computed(() =>
  typeof props.data?.sectionId === 'string'
    ? props.data.sectionId.trim().replace(/^#+/, '')
    : '',
);

/* Dentro de PageSections.vue el ancla universal .page-section__anchor la emite el contenedor;
 * aquí solo queda de respaldo si el bloque se monta de forma aislada fuera de PageSections. */
const handledByPageSections = computed(() => Boolean(attrs['data-block-id']));

const anchorId = computed(() => {
  if (handledByPageSections.value || !customId.value) return '';
  return attrs.id && attrs.id !== customId.value ? customId.value : '';
});

const normalized = computed(() => buildCardsVersion2Data(props.data));
const cards = computed<CardVersion2Item[]>(() => normalized.value.cards);

const isListLayout = computed(() => props.data?.layout === 'list' || props.data?.isList === true);
</script>
