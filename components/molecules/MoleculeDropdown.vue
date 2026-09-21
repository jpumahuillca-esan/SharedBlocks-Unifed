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
 *
 * Dos usos, los dos del kit:
 * - Menú de acciones (el de la guía viva): ítems que emiten `select`.
 * - Menú de navegación (el del topbar): ítems con `href`, que salen como
 *   enlaces y navegan. Con `plain`, el disparador deja de ser un botón y
 *   queda como texto con flecha, para que quien lo use le dé el aspecto de
 *   sus enlaces. Ambos son aditivos: sin ellos, todo sigue como antes.
 */
import { computed, onMounted, onBeforeUnmount, useTemplateRef } from 'vue';
import AtomButton from '../atoms/AtomButton.vue';
import AtomIcon from '../atoms/AtomIcon.vue';
import { useDynamicLink } from '../../composables/useDynamicLink';

export interface DropdownItem {
  label?: string;
  icon?: string;
  /** true: separador horizontal en vez de ítem clickeable. */
  divider?: boolean;
  /** Con destino, el ítem es un enlace que navega en vez de una acción. */
  href?: string;
}

const props = withDefaults(defineProps<{
  label: string;
  items: DropdownItem[];
  /** "right": abre alineado al borde derecho (triggers cerca del límite del viewport). */
  align?: 'left' | 'right';
  /**
   * Disparador sin aspecto de botón: solo el texto y la flecha. El color y la
   * tipografía los pone quien lo usa, sobre `.dropdown__trigger`.
   */
  plain?: boolean;
  /** Para los ítems con `href`: NuxtLink en public-site; sin él, un <a>. */
  linkComponent?: any;
}>(), {
  align: 'left',
  plain: false,
});

const { linkTag, getLinkProps } = useDynamicLink(props.linkComponent);

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

/**
 * El disparador `plain` es un <a> sin destino (decisión de proyecto: nunca
 * <button>, ver AtomButton), y un <a> sin href no responde al teclado por sí
 * solo: se le da lo que un botón traería de fábrica, Enter y Espacio.
 */
const onTriggerKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;

  // Espacio, sin esto, desplaza la página.
  event.preventDefault();
  toggle();
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
    <a
      v-if="plain"
      class="dropdown__trigger"
      role="button"
      tabindex="0"
      aria-haspopup="true"
      :aria-expanded="String(isOpen)"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      {{ label }}
      <AtomIcon name="chevron-down" :size="16" />
    </a>

    <AtomButton
      v-else
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
        <component
          :is="linkTag"
          v-else-if="item.href"
          v-bind="getLinkProps(item.href)"
          class="dropdown__item"
          role="menuitem"
          @click="selectItem(item, index)"
        >
          <AtomIcon v-if="item.icon" :name="item.icon" :size="16" />
          {{ item.label }}
        </component>
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
