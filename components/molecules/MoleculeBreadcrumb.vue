<script setup lang="ts">
/**
 * MoleculeBreadcrumb — Breadcrumb (ARCIS Design System, Elementos >
 * Breadcrumb).
 *
 * Vive en components/molecules/ y no en components/atoms/ porque
 * compone el átomo AtomIcon (separador "chevron-right" fijo entre
 * ítems) — mismo criterio que MoleculeAlert/MoleculePagination.
 *
 * Envuelve las clases .breadcrumb/.breadcrumb__item/.breadcrumb__link/
 * .breadcrumb__current portadas en assets/styles/elements/_breadcrumb.scss.
 * No redeclara estilos propios.
 *
 * El último ítem de `items` nunca es un link (se renderiza como
 * .breadcrumb__current, con aria-current="page"), igual que en
 * webunificada — no hace falta indicarlo aparte, se infiere de su
 * posición en el array.
 */
import AtomIcon from '../atoms/AtomIcon.vue';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

withDefaults(defineProps<{
  items: BreadcrumbItem[];
}>(), {
  items: () => [],
});
</script>

<template>
  <nav class="breadcrumb breadcrumb--arcis" aria-label="Breadcrumb">
    <span v-for="(item, index) in items" :key="index" class="breadcrumb__item">
      <AtomIcon v-if="index > 0" name="chevron-right" :size="14" />
      <a v-if="index < items.length - 1" class="breadcrumb__link" :href="item.href || '#'">{{ item.label }}</a>
      <span v-else class="breadcrumb__current" aria-current="page">{{ item.label }}</span>
    </span>
  </nav>
</template>
