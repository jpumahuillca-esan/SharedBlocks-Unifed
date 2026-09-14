<script lang="ts">
import { ref } from 'vue';

/**
 * Estado compartido a nivel de MÓDULO (no por instancia de componente):
 * guarda el id de la única instancia de MoleculeDropdown abierta en toda
 * la página. Reproduce closeAll() de initDropdowns() en webunificada
 * (abrir un dropdown cierra todos los demás) sin necesidad de un store
 * aparte — todas las instancias importan este mismo módulo, así que
 * comparten esta misma ref.
 */
const openDropdownId = ref<symbol | null>(null);
</script>

<script setup lang="ts">
/**
 * MoleculeDropdown — menú contextual (ARCIS Design System, Elementos >
 * Dropdown). Se cierra al hacer click afuera, al elegir una opción o
 * con Escape — igual que initDropdowns() en webunificada.
 *
 * Vive en components/molecules/ y no en components/atoms/ porque
 * compone AtomButton (trigger) y AtomIcon (chevron + íconos de ítems)
 * — mismo criterio que MoleculeAlert/MoleculeCollapse.
 *
 * Envuelve ".dropdown"/".dropdown__trigger"/".dropdown__menu"/
 * ".dropdown__item"/".dropdown__divider" portadas en
 * assets/styles/elements/_dropdown.scss. No redeclara estilos propios.
 */
import { computed, onMounted, onBeforeUnmount, useTemplateRef } from 'vue';
import AtomButton from '../atoms/AtomButton.vue';
import AtomIcon from '../atoms/AtomIcon.vue';

export interface DropdownItem {
  label?: string;
  icon?: string;
  /** true: separador horizontal en vez de ítem clickeable. */
  divider?: boolean;
}

const props = withDefaults(defineProps<{
  label: string;
  items: DropdownItem[];
  /** "right": abre alineado al borde derecho (triggers cerca del límite del viewport). */
  align?: 'left' | 'right';
}>(), {
  align: 'left',
});

const emit = defineEmits<{
  select: [item: DropdownItem, index: number];
}>();

const id = Symbol('dropdown');
const rootRef = useTemplateRef<HTMLElement>('root');

const isOpen = computed(() => openDropdownId.value === id);

const toggle = () => {
  openDropdownId.value = isOpen.value ? null : id;
};

const selectItem = (item: DropdownItem, index: number) => {
  openDropdownId.value = null;
  emit('select', item, index);
};

const onDocumentClick = (event: MouseEvent) => {
  if (!isOpen.value) return;
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    openDropdownId.value = null;
  }
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') openDropdownId.value = null;
};

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
  document.removeEventListener('keydown', onKeydown);
  if (isOpen.value) openDropdownId.value = null;
});

const classes = computed(() => [
  'dropdown',
  'dropdown--arcis',
  props.align === 'right' ? 'dropdown--right' : null,
  isOpen.value ? 'is-open' : null,
]);
</script>

<template>
  <div ref="root" :class="classes">
    <AtomButton
      variant="secondary"
      class="dropdown__trigger"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      {{ label }}
      <AtomIcon name="chevron-down" :size="16" />
    </AtomButton>

    <div class="dropdown__menu" role="menu">
      <template v-for="(item, index) in items" :key="index">
        <hr v-if="item.divider" class="dropdown__divider" />
        <button
          v-else
          type="button"
          class="dropdown__item"
          role="menuitem"
          @click="selectItem(item, index)"
        >
          <AtomIcon v-if="item.icon" :name="item.icon" :size="16" />
          {{ item.label }}
        </button>
      </template>
    </div>
  </div>
</template>
