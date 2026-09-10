<script setup lang="ts">
/**
 * MoleculeListGroup — List Group (ARCIS Design System, Elementos >
 * List Group), lista vertical con ítems interactivos.
 *
 * Vive en components/molecules/ y no en components/atoms/ porque
 * compone el átomo AtomIcon (ícono del ítem + chevron final fijo) —
 * mismo criterio que MoleculeAlert/MoleculeBreadcrumb.
 *
 * Envuelve las clases .list-group/.list-group__item/
 * .list-group__item-label portadas en assets/styles/elements/_list-group.scss.
 * No redeclara estilos propios.
 */
import AtomIcon from '../atoms/AtomIcon.vue';

export interface ListGroupItem {
  label: string;
  icon?: string;
  href?: string;
  active?: boolean;
}

defineProps<{
  items: ListGroupItem[];
}>();

const emit = defineEmits<{
  select: [item: ListGroupItem, index: number];
}>();
</script>

<template>
  <div class="list-group list-group--arcis">
    <a
      v-for="(item, index) in items"
      :key="index"
      class="list-group__item"
      :class="{ 'is-active': item.active }"
      :href="item.href || '#'"
      @click="emit('select', item, index)"
    >
      <span class="list-group__item-label">
        <AtomIcon v-if="item.icon" :name="item.icon" :size="18" />
        {{ item.label }}
      </span>
      <AtomIcon name="chevron-right" :size="16" />
    </a>
  </div>
</template>
