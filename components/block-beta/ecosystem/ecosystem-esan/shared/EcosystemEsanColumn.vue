<template>
  <div class="ecosystem-esan__item">
    <EcosystemEsanCard
      :item="item"
    />
  </div>
</template>

<script setup lang="ts">
import EcosystemEsanCard from './EcosystemEsanCard.vue';

import type {
  EcosystemEsanItem,
} from './types';

defineProps<{
  item: EcosystemEsanItem;
}>();
</script>