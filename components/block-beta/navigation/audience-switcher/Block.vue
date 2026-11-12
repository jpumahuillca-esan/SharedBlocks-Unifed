<template>
  <div class="audience-switcher">
    <div class="audience-switcher__inner">
      <h3
        v-if="normalized.title"
        class="audience-switcher__title"
        v-bind="edit('title')"
      >
        {{ normalized.title }}
      </h3>

      <div v-if="normalized.cards.length" class="audience-switcher__cards">
        <a
          v-for="(card, i) in normalized.cards"
          :key="card.id || i"
          :href="card.href || '#'"
          :target="card.target || '_self'"
          class="audience-switcher__card"
          v-bind="edit(`cards.${i}`)"
        >
          <img
            v-if="card.image"
            :src="card.image"
            :alt="card.imageAlt || card.title"
            class="audience-switcher__card-image"
            loading="lazy"
          />
          <div class="audience-switcher__card-overlay" aria-hidden="true"></div>
          <div class="audience-switcher__card-content">
            <h4 class="audience-switcher__card-title">{{ card.title }}</h4>
            <p v-if="card.desc" class="audience-switcher__card-desc">{{ card.desc }}</p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { normalizeAudienceSwitcherData, type AudienceSwitcherData } from './shared/types';
import { useEditTarget } from '../../../../core/editFocus';

const props = defineProps<{
  data: AudienceSwitcherData;
}>();

const edit = useEditTarget();
const normalized = computed(() => normalizeAudienceSwitcherData(props.data));
</script>

