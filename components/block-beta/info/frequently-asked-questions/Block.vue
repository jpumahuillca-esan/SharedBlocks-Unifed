<template>
  <section class="info-faq-section">
    <div class="info-faq-section__container">
      <header v-if="content.title" class="info-faq-section__header">
        <h2 class="info-faq-section__title" v-bind="edit('title')">{{ content.title }}</h2>
        <span class="info-faq-section__rule" aria-hidden="true"></span>
      </header>

      <div v-if="content.items.length" class="info-faq-section__list">
        <MoleculeCollapse
          v-for="(item, index) in content.items"
          :key="item.id"
          :title="item.question"
          v-bind="edit(`items.${index}`)"
        >
          {{ item.answer }}
        </MoleculeCollapse>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MoleculeCollapse from '../../../molecules/MoleculeCollapse.vue';
import { useEditTarget } from '../../../../core/editFocus';
import { normalizeFrequentlyAskedQuestions, type FrequentlyAskedQuestionsData } from './shared/types';

const props = defineProps<{ data?: Partial<FrequentlyAskedQuestionsData> }>();
const edit = useEditTarget();
const content = computed(() => normalizeFrequentlyAskedQuestions(props.data));
</script>
