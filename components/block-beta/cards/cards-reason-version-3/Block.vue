<template>
  <section class="cards-reason-v3-section">
    <div class="cards-r3__container">
      <!-- Encabezado centrado construido con átomos ARCIS -->
      <header v-if="data.eyebrow || data.title || data.desc" class="cards-r3__header">
        <AtomEyebrow v-if="data.eyebrow">
          {{ data.eyebrow }}
        </AtomEyebrow>

        <AtomHeading
          v-if="data.title"
          :level="2"
          size="h2"
          weight="bold"
          class="cards-r3__title"
        >
          {{ data.title }}
        </AtomHeading>

        <!-- Guion rojo de acento bajo el título -->
        <span v-if="data.title" class="cards-r3__rule" aria-hidden="true"></span>

        <!-- Descripción opcional -->
        <AtomText
          v-if="data.desc"
          size="body"
          color="secondary"
          class="cards-r3__desc"
        >
          {{ data.desc }}
        </AtomText>
      </header>

      <!-- Rejilla de tarjetas -->
      <div v-if="cards.length" class="cards-r3__grid">
        <component
          :is="card.href ? 'a' : 'div'"
          v-for="card in cards"
          :key="card.id"
          :href="card.href || undefined"
          :target="card.target || undefined"
          :rel="card.target === '_blank' ? 'noopener noreferrer' : undefined"
          class="cards-r3__card"
        >
          <!-- Cifra o métrica destacada en rojo institucional -->
          <AtomHeading
            :level="3"
            as="span"
            size="h1"
            weight="bold"
            class="cards-r3__card-number"
          >
            {{ card.number }}
          </AtomHeading>

          <!-- Texto descriptivo de la métrica -->
          <AtomText
            size="body-sm"
            class="cards-r3__card-text"
          >
            {{ card.label }}
          </AtomText>
        </component>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Bloque Cards Reason Version 3 (ARCIS Design System).
 *
 * Muestra razones y métricas destacadas de la institución (ej. "1º", "3º", "11", "+130").
 * Reutiliza los átomos oficiales de la librería:
 * - AtomEyebrow: Antetítulo opcional
 * - AtomHeading: Título principal (h2) y cifras destacadas (h3 semántico con aspecto h1)
 * - AtomText: Descripción de sección y textos explicativos de cada tarjeta
 *
 * Disposición responsiva:
 * - Escritorio: 4 columnas en 1 fila
 * - Tableta: 2 columnas por fila (rejilla 2x2)
 * - Móvil: 1 columna al 100% de ancho (apiladas)
 */
import { computed } from 'vue';
import AtomEyebrow from '../../../atoms/AtomEyebrow.vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import { buildCardsReasonVersion3Data, type CardReasonItem } from './types';

const props = defineProps<{
  data: any;
}>();

const normalized = computed(() => buildCardsReasonVersion3Data(props.data));
const cards = computed<CardReasonItem[]>(() => normalized.value.cards);
</script>
