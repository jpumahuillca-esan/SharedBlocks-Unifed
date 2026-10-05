<template>
  <section class="ecosystem">
    <div class="ecosystem__inner">
      <header v-if="data.title || data.desc" class="ecosystem__header">
        <AtomHeading
          v-if="data.title"
          :level="2"
          size="h2"
          weight="bold"
          align="center"
          class="ecosystem__title"
          v-bind="edit('title')"
        >
          {{ data.title }}
        </AtomHeading>

        <!-- Entre el título y la descripción, como en la referencia. -->
        <span class="ecosystem__rule" aria-hidden="true"></span>

        <AtomText v-if="data.desc" size="body" align="center" class="ecosystem__desc" v-bind="edit('desc')">
          {{ data.desc }}
        </AtomText>
      </header>

      <div class="ecosystem__layout">
        <!-- Columna izquierda: las tarjetas grandes -->
        <div v-if="features.length" class="ecosystem__features">
          <EcosystemCard
            v-for="(card, i) in features"
            v-bind="edit(`features.${i}`)"
            :key="card.id"
            :card="card"
            variant="feature"
            :title-level="featuresTitleLevel"
          />
        </div>

        <!-- Columna derecha: la franja y el grupo de facultades -->
        <div class="ecosystem__group">
          <EcosystemBar
            v-if="bar.title"
            v-bind="edit('bar')"
            :title="bar.title"
            :desc="bar.desc"
            :href="bar.href"
            :target="bar.target"
          />

          <div v-if="faculties.length" class="ecosystem__faculties">
            <EcosystemCard
              v-for="(card, i) in faculties"
              v-bind="edit(`faculties.${i}`)"
              :key="card.id"
              :card="card"
              variant="faculty"
              :title-level="facultiesTitleLevel"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Sección del ecosistema académico.
 *
 * Encabezado centrado y, debajo, dos grupos: las escuelas grandes a la
 * izquierda y el conjunto de facultades a la derecha, presidido por su franja.
 * El contenido se escribe desde el editor; no consulta ninguna API.
 *
 * La reordenación por tamaño de pantalla es enteramente de la hoja de estilos:
 * en tableta los dos grupos se apilan y las facultades cambian de composición,
 * pero el marcado es el mismo en los tres tamaños.
 */
import { computed } from 'vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import EcosystemCard from '../_shared/EcosystemCard.vue';
import EcosystemBar from '../_shared/EcosystemBar.vue';
import { normalizeLinkTarget } from '../../../../helpers/linkTarget';
import { useEditTarget } from '../../../../core/editFocus';
import {
  DEFAULT_FACULTIES_TITLE_LEVEL,
  DEFAULT_FEATURES_TITLE_LEVEL,
  normalizeEcosystemCard,
  normalizeEcosystemTitleLevel,
  type EcosystemCardItem,
} from '../_shared/types';

const props = defineProps<{ data: any }>();

/* Marcas para el enfoque de campos del constructor (core/editFocus.ts). */
const edit = useEditTarget();

/** Las dos listas se normalizan igual; solo cambia de dónde salen. */
const toCards = (raw: unknown): EcosystemCardItem[] =>
  (Array.isArray(raw) ? raw : []).map((card, i) => normalizeEcosystemCard(card, i));

const features = computed(() => toCards(props.data?.features));
const faculties = computed(() => toCards(props.data?.faculties));

const featuresTitleLevel = computed(() =>
  normalizeEcosystemTitleLevel(props.data?.featuresTitleLevel, DEFAULT_FEATURES_TITLE_LEVEL),
);
const facultiesTitleLevel = computed(() =>
  normalizeEcosystemTitleLevel(props.data?.facultiesTitleLevel, DEFAULT_FACULTIES_TITLE_LEVEL),
);

const bar = computed(() => ({
  title: props.data?.bar?.title ?? '',
  desc: props.data?.bar?.desc ?? '',
  href: props.data?.bar?.href ?? '',
  target: normalizeLinkTarget(props.data?.bar?.target),
}));
</script>
