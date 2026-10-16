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
import AtomLink from '../atoms/AtomLink.vue';

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
  <nav
    class="breadcrumb breadcrumb--arcis"
    aria-label="Breadcrumb"
    itemscope
    itemtype="https://schema.org/BreadcrumbList"
  >
    <span
      v-for="(item, index) in items"
      :key="index"
      class="breadcrumb__item"
      itemprop="itemListElement"
      itemscope
      itemtype="https://schema.org/ListItem"
    >
      <AtomIcon v-if="index > 0" name="chevron-right" :size="14" aria-hidden="true" />
      
      <!-- Enlace con SEO y navegación SPA reactiva (sin recargar página) -->
      <AtomLink
        v-if="item.href"
        class="breadcrumb__link"
        :href="item.href"
        itemprop="item"
      >
        <span itemprop="name">{{ item.label }}</span>
      </AtomLink>

      <!-- Último ítem o nivel sin enlace: texto actual -->
      <template v-else>
        <span
          class="breadcrumb__current"
          :aria-current="index === items.length - 1 ? 'page' : undefined"
          itemprop="name"
        >
          {{ item.label }}
        </span>
      </template>

      <!-- Posición obligatoria para Google BreadcrumbList -->
      <meta itemprop="position" :content="String(index + 1)" />
    </span>
  </nav>
</template>
