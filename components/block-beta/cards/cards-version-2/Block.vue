<template>
  <section
    class="cards-v2-section"
    :class="{ 'cards-v2-section--white': (data?.backgroundColor || normalized.backgroundColor) === '#FFFFFF' }"
    :style="{ backgroundColor: data?.backgroundColor || normalized.backgroundColor || '#F1F5F9' }"
  >
    <div class="cards-v2__container">
      <!-- Encabezado centrado construido con átomos ARCIS -->
      <header v-if="data.eyebrow || data.title || data.desc" class="cards-v2__header">
        <AtomEyebrow
          v-if="data.eyebrow"
          :color-token="data.eyebrowColorToken"
        >
          {{ data.eyebrow }}
        </AtomEyebrow>

        <AtomHeading
          v-if="data.title"
          :level="2"
          size="h2"
          weight="bold"
          class="cards-v2__title"
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
        >
          {{ data.desc }}
        </AtomText>
      </header>

      <!-- Rejilla de tarjetas -->
      <div v-if="cards.length" class="cards-v2__grid">
        <component
          :is="card.href ? 'a' : 'div'"
          v-for="card in cards"
          :key="card.id"
          :href="card.href || undefined"
          :target="card.target || undefined"
          :rel="card.target === '_blank' ? 'noopener noreferrer' : undefined"
          class="cards-v2__card"
        >
          <!-- Ícono izquierdo en recuadro suave con AtomIcon -->
          <span class="cards-v2__icon-box" aria-hidden="true">
            <AtomIcon :name="card.icon || 'graduation-cap'" :size="22" />
          </span>

          <!-- Contenido central: Título con AtomHeading y descripción con AtomText -->
          <div class="cards-v2__content">
            <AtomHeading
              :level="3"
              size="body"
              weight="semibold"
              class="cards-v2__card-title"
            >
              {{ card.title }}
            </AtomHeading>

            <AtomText
              v-if="card.desc"
              size="body-sm"
              color="secondary"
              class="cards-v2__card-desc"
            >
              {{ card.desc }}
            </AtomText>
          </div>

          <!-- Flecha roja a la derecha con AtomIcon -->
          <span class="cards-v2__arrow" aria-hidden="true">
            <AtomIcon name="chevron-right" :size="18" />
          </span>
        </component>
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
 * Disposición responsiva:
 * - Escritorio: 3 columnas por fila (filas restantes centradas).
 * - Tableta: 2 columnas por fila (última tarjeta centrada).
 * - Móvil: 1 columna al 100% de ancho.
 */
import { computed } from 'vue';
import AtomEyebrow from '../../../atoms/AtomEyebrow.vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import { buildCardsVersion2Data, type CardVersion2Item } from './types';

const props = defineProps<{
  data: any;
}>();

const normalized = computed(() => buildCardsVersion2Data(props.data));
const cards = computed<CardVersion2Item[]>(() => normalized.value.cards);
</script>
