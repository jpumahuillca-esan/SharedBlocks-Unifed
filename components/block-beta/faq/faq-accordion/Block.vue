<template>
  <section class="faq-accordion-block">
    <div class="faq-accordion-block__inner">
      <header v-if="dataNormalized.eyebrow || dataNormalized.title || dataNormalized.desc" class="faq-accordion-block__header">
        <AtomEyebrow
          v-if="dataNormalized.eyebrow"
          as="p"
          class="faq-accordion-block__eyebrow"
          v-bind="edit('eyebrow')"
        >
          {{ dataNormalized.eyebrow }}
        </AtomEyebrow>

        <AtomHeading
          v-if="dataNormalized.title"
          :level="2"
          size="h2"
          weight="bold"
          class="faq-accordion-block__title"
          v-bind="edit('title')"
        >
          {{ dataNormalized.title }}
        </AtomHeading>

        <span
          v-if="dataNormalized.title"
          class="faq-accordion-block__rule"
          aria-hidden="true"
        ></span>

        <AtomText
          v-if="dataNormalized.desc"
          size="body"
          class="faq-accordion-block__desc"
          v-bind="edit('desc')"
        >
          {{ dataNormalized.desc }}
        </AtomText>
      </header>

      <!-- Buscador interactivo (opcional según configuración) -->
      <div v-if="dataNormalized.showSearch" class="faq-accordion-block__search-wrapper">
        <span class="faq-accordion-block__search-icon" aria-hidden="true">
          <AtomIcon name="search" :size="20" />
        </span>

        <input
          v-model="searchQuery"
          type="text"
          class="faq-accordion-block__search-input"
          :placeholder="dataNormalized.searchPlaceholder"
          aria-label="Buscar pregunta frecuente"
        />

        <button
          v-if="searchQuery"
          type="button"
          class="faq-accordion-block__search-clear"
          aria-label="Limpiar búsqueda"
          @click="searchQuery = ''"
        >
          &times;
        </button>
      </div>

      <!-- Lista de acordeones -->
      <div v-if="filteredItems.length" class="faq-accordion-block__list">
        <MoleculeCollapse
          v-for="(item, index) in filteredItems"
          :key="item.id"
          :title="item.question"
          :default-open="Boolean(item.defaultOpen) || (searchQuery.trim().length > 0)"
          v-bind="edit(`items.${item.originalIndex ?? index}`)"
        >
          <div v-html="item.answer"></div>
        </MoleculeCollapse>
      </div>

      <!-- Estado vacío cuando la búsqueda no coincide -->
      <div v-else class="faq-accordion-block__empty">
        <AtomText size="body">
          No se encontraron preguntas que coincidan con <strong>"{{ searchQuery }}"</strong>.
        </AtomText>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AtomEyebrow from '../../../atoms/AtomEyebrow.vue';
import AtomHeading from '../../../atoms/AtomHeading.vue';
import AtomText from '../../../atoms/AtomText.vue';
import AtomIcon from '../../../atoms/AtomIcon.vue';
import MoleculeCollapse from '../../../molecules/MoleculeCollapse.vue';
import { useEditTarget } from '../../../../core/editFocus';
import { buildFaqAccordionData, type FaqAccordionData } from './shared/types';

const props = defineProps<{
  data: Partial<FaqAccordionData> | any;
}>();

const edit = useEditTarget();
const searchQuery = ref('');

const dataNormalized = computed(() => buildFaqAccordionData(props.data));

const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  const list = dataNormalized.value.items.map((item, originalIndex) => ({
    ...item,
    originalIndex,
  }));

  if (!query) return list;

  return list.filter((item) => {
    const q = (item.question || '').toLowerCase();
    const a = (item.answer || '').toLowerCase();
    const c = (item.category || '').toLowerCase();
    return q.includes(query) || a.includes(query) || c.includes(query);
  });
});
</script>

