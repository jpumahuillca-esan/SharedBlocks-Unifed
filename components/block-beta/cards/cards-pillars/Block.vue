<template>
  <section class="cards-pillars-section">
    <div class="cards-pillars__container">
      <header v-if="data.title" class="cards-pillars__header">
        <AtomHeading
          v-bind="edit('title')"
          :level="2"
          size="h2"
          weight="semibold"
          class="cards-pillars__title"
        >
          {{ data.title }}
        </AtomHeading>
        <span class="cards-pillars__rule" aria-hidden="true"></span>
      </header>

      <div
        v-if="data.cards.length"
        class="cards-pillars__grid"
        :style="{ '--cards-pillars-columns': String(Math.min(data.cards.length, 5)) }"
      >
        <MoleculeCard
          v-for="(card, index) in data.cards"
          v-bind="edit('cards.' + index)"
          :key="card.id"
          class="cards-pillars__card"
        >
          <template #eyebrow>
            <span class="cards-pillars__icon" aria-hidden="true">
              <AtomIcon :name="card.icon" :size="48" />
            </span>
          </template>

          <AtomHeading
            v-if="card.title"
            v-bind="edit('.title')"
            :level="3"
            size="h6"
            weight="regular"
            class="cards-pillars__card-title"
          >
            {{ card.title }}
          </AtomHeading>
        </MoleculeCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import MoleculeCard from '../../../molecules/MoleculeCard.vue';
import { useEditTarget } from '../../../../core/editFocus';
import { buildCardsPillarsData } from './_shared/types';

const props = defineProps<{ data: any }>();

const edit = useEditTarget();
const data = computed(() => buildCardsPillarsData(props.data));
</script>
