<template>
  <div class="breadcrumb-block py-2" :class="{ 'container': isBoxed }">
    <MoleculeBreadcrumb :items="resolvedItems" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MoleculeBreadcrumb, { type BreadcrumbItem } from '../../../molecules/MoleculeBreadcrumb.vue';

const props = defineProps<{
  data?: any;
}>();

const isBoxed = computed(() => props.data?.isBoxed !== false);

const resolvedItems = computed<BreadcrumbItem[]>(() => {
  const items = props.data?.items;
  const includeCurrent = props.data?.includeCurrentPage === true && props.data?.explicitIncludeCurrent === true;

  if (Array.isArray(items) && items.length > 0) {
    // Si la directiva SEO exige omitir la página actual al final:
    if (!includeCurrent && items.length > 1) {
      const last = items[items.length - 1];
      // Si el último ítem no tiene enlace (es la página actual) o coincide con currentPage:
      if (
        !last.href ||
        (props.data?.currentPage && last.label?.trim().toLowerCase() === props.data.currentPage.trim().toLowerCase())
      ) {
        return items.slice(0, -1);
      }
    }
    return items;
  }

  const fallback: BreadcrumbItem[] = [{ label: 'Inicio', href: '/' }];
  if (includeCurrent && props.data?.currentPage) {
    fallback.push({ label: props.data.currentPage });
  }
  return fallback;
});
</script>

<style scoped>
.breadcrumb-block {
  width: 100%;
}
</style>
