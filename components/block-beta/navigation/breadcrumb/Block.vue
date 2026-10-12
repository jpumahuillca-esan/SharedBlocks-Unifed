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
  if (Array.isArray(props.data?.items) && props.data.items.length > 0) {
    return props.data.items;
  }
  const fallback: BreadcrumbItem[] = [{ label: 'Inicio', href: '/' }];
  if (props.data?.currentPage && props.data?.includeCurrentPage !== false) {
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
