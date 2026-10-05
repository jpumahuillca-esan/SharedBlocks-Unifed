<template>
  <section class="cards-reason-v3-section">
    <div class="cards-r3__container">
      <!-- Encabezado centrado construido con átomos ARCIS -->
      <header v-if="data.eyebrow || data.title || data.desc" class="cards-r3__header">
        <AtomEyebrow v-if="data.eyebrow" v-bind="edit('eyebrow')">
          {{ data.eyebrow }}
        </AtomEyebrow>

        <AtomHeading
          v-if="data.title"
          :level="2"
          size="h2"
          weight="bold"
          class="cards-r3__title"
          v-bind="edit('title')"
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
          v-bind="edit('desc')"
        >
          {{ data.desc }}
        </AtomText>
      </header>

      <!-- Rejilla de tarjetas -->
      <div v-if="cards.length" class="cards-r3__grid">
        <AtomLink
          v-for="(card, i) in cards"
          v-bind="edit(`cards.${i}`)"
          :key="card.id"
          :href="card.href || undefined"
          :target="card.target"
          as="div"
          class="cards-r3__card"
        >
          <!-- Cifra o métrica destacada en rojo institucional -->
          <AtomHeading
            :level="3"
            as="span"
            size="h1"
            weight="bold"
            class="cards-r3__card-number"
            v-bind="edit('.number')"
          >
            {{ card.number }}
          </AtomHeading>

          <!-- Texto descriptivo de la métrica -->
          <AtomText
            size="body-sm"
            class="cards-r3__card-text"
            v-bind="edit('.label')"
          >
            {{ card.label }}
          </AtomText>
        </AtomLink>
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
import AtomLink from '../../../atoms/AtomLink.vue';
import { buildCardsReasonVersion3Data, type CardReasonItem } from './types';
import { useEditTarget } from '../../../../core/editFocus';

/* Marcas para el enfoque de campos del constructor (core/editFocus.ts). */
const edit = useEditTarget();

const props = defineProps<{
  data: any;
}>();

const normalized = computed(() => buildCardsReasonVersion3Data(props.data));
const cards = computed<CardReasonItem[]>(() => normalized.value.cards);
</script>
