<template>
  <section
    class="ecosystem-esan"
    :class="`ecosystem-esan--cols-${dataNormalized.columns}`"
  >
    <div class="ecosystem-esan__inner">
      <header
        v-if="dataNormalized.title || dataNormalized.desc"
        class="ecosystem-esan__header"
      >
        <AtomHeading
          v-if="dataNormalized.title"
          :level="2"
          size="h2"
          weight="semibold"
          align="center"
          class="ecosystem-esan__title"
          v-bind="edit('title')"
        >
          {{ dataNormalized.title }}
        </AtomHeading>

        <span
          v-if="dataNormalized.title"
          class="ecosystem-esan__rule"
          aria-hidden="true"
        ></span>

        <AtomText
          v-if="dataNormalized.desc"
          size="body-lg"
          align="center"
          class="ecosystem-esan__desc"
          v-bind="edit('desc')"
        >
          {{ dataNormalized.desc }}
        </AtomText>
      </header>

      <div
        v-if="dataNormalized.items.length"
        class="ecosystem-esan__grid"
      >
        <EcosystemEsanColumn
          v-for="(item, i) in dataNormalized.items"
          v-bind="edit(`items.${i}`)"
          :key="item.id"
          :item="item"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';

import EcosystemEsanColumn from './shared/EcosystemEsanColumn.vue';

import {
  normalizeEcosystemEsanData,
} from './shared/types';
import { useEditTarget } from '../../../../core/editFocus';

/* Marcas para el enfoque de campos del constructor (core/editFocus.ts). */
const edit = useEditTarget();

const props = defineProps<{
  data: any;
}>();

const dataNormalized = computed(() =>
  normalizeEcosystemEsanData(
    props.data,
  ),
);
</script>