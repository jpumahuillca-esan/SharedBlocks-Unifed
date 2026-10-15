<template>
  <div class="breadcrumb-block">
    <AtomDivider variant="horizontal" />
    <div class="breadcrumb-block__inner" :class="{ 'breadcrumb-block__inner--boxed': isBoxed }">
      <MoleculeBreadcrumb :items="resolvedItems" />
    </div>
    <AtomDivider variant="horizontal" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AtomDivider from '../../../atoms/AtomDivider.vue';
import MoleculeBreadcrumb,{ type BreadcrumbItem } from '../../../molecules/MoleculeBreadcrumb.vue';

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
