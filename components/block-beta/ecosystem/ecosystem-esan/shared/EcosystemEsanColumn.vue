<template>
  <div class="ecosystem-esan__item">
    <EcosystemEsanCard
      :item="item"
    />

    <ul
      v-if="item.links.length"
      class="ecosystem-esan__links"
      :aria-label="
        `Enlaces de ${item.title}`
      "
    >
      <li
        v-for="(link, li) in item.links"
        v-bind="edit(`.links.${li}.label`)"
        :key="link.id"
        class="ecosystem-esan__link-item"
      >
        <AtomButton
          variant="list"
          :href="
            link.href ||
            undefined
          "
          :target="link.target"
          class="ecosystem-esan__link"
        >
          <span>
            {{ link.label }}
          </span>

          <AtomIcon
            name="arrow-right"
            :size="16"
          />
        </AtomButton>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import AtomButton from '../../../../atoms/AtomButton.vue';
import AtomIcon from '../../../../atoms/AtomIcon.vue';

import EcosystemEsanCard from './EcosystemEsanCard.vue';

import type {
  EcosystemEsanItem,
} from './types';
import { useEditTarget } from '../../../../../core/editFocus';

/* Marcas para el enfoque de campos del constructor (core/editFocus.ts). */
const edit = useEditTarget();

defineProps<{
  item: EcosystemEsanItem;
}>();
</script>