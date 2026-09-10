<script setup lang="ts">
/**
 * MoleculePagination — Pagination (ARCIS Design System, Elementos >
 * Pagination).
 *
 * Vive en components/molecules/ y no en components/atoms/ porque
 * compone el átomo AtomIcon (flecha "chevron-right", reutilizada rotada
 * 180° para "Anterior") — mismo criterio que MoleculeAlert.
 *
 * Envuelve las clases .pagination/.pagination__item/.pagination__ellipsis
 * portadas en assets/styles/elements/_pagination.scss. No redeclara
 * estilos propios. ".pagination__item--nav" se agrega en el markup igual
 * que en webunificada, pero no tiene regla CSS propia (verificado en
 * main.css) — es solo un marcador semántico, sin efecto visual propio.
 *
 * Windowing: siempre muestra la página 1 y la última, más
 * `siblingCount` páginas a cada lado de la actual, con "…" en los
 * huecos. Con los valores por defecto (siblingCount=2) y
 * currentPage=1/totalPages=8 reproduce exactamente el ejemplo de la
 * guía viva: 1, 2, 3, …, 8.
 */
import { computed } from 'vue';
import AtomIcon from '../atoms/AtomIcon.vue';

const props = withDefaults(defineProps<{
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}>(), {
  siblingCount: 2,
});

const emit = defineEmits<{
  change: [page: number];
}>();

const pages = computed<(number | 'ellipsis')[]>(() => {
  const total = props.totalPages;
  const current = props.currentPage;

  if (total <= 1) return [1];

  const left = Math.max(2, current - props.siblingCount);
  const right = Math.min(total - 1, current + props.siblingCount);

  const items: (number | 'ellipsis')[] = [1];
  if (left > 2) items.push('ellipsis');
  for (let i = left; i <= right; i++) items.push(i);
  if (right < total - 1) items.push('ellipsis');
  items.push(total);
  return items;
});

const goTo = (page: number) => {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return;
  emit('change', page);
};
</script>

<template>
  <nav class="pagination pagination--arcis" aria-label="Paginación">
    <a
      href="#"
      class="pagination__item pagination__item--nav"
      :class="{ 'is-disabled': currentPage <= 1 }"
      aria-label="Anterior"
      @click.prevent="goTo(currentPage - 1)"
    >
      <AtomIcon name="chevron-right" :size="16" style="transform: rotate(180deg)" />
    </a>

    <template v-for="(page, index) in pages" :key="index">
      <span v-if="page === 'ellipsis'" class="pagination__ellipsis">…</span>
      <a
        v-else
        href="#"
        class="pagination__item"
        :class="{ 'is-active': page === currentPage }"
        :aria-current="page === currentPage ? 'page' : undefined"
        @click.prevent="goTo(page)"
      >
        {{ page }}
      </a>
    </template>

    <a
      href="#"
      class="pagination__item pagination__item--nav"
      :class="{ 'is-disabled': currentPage >= totalPages }"
      aria-label="Siguiente"
      @click.prevent="goTo(currentPage + 1)"
    >
      <AtomIcon name="chevron-right" :size="16" />
    </a>
  </nav>
</template>
