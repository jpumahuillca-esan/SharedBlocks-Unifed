<script setup lang="ts">
/**
 * MoleculeTabs — pestañas (ARCIS Design System, Elementos > Tabs).
 *
 * Vive en components/molecules/ y no en components/atoms/ porque compone
 * AtomIcon (el ícono opcional de cada pestaña) — mismo criterio que
 * MoleculeChip/MoleculeCollapse.
 *
 * Envuelve las clases .tabs/.tabs__list/.tabs__tab portadas en
 * assets/styles/elements/_tabs.scss. No redeclara estilos propios.
 *
 * Tres formas, las tres del Figma:
 * - "underline" (por defecto): fila con filete compartido y una barra
 *   roja bajo la pestaña activa.
 * - "vertical": la misma idea girada, con el filete a la izquierda.
 * - "cards": cada pestaña es su propia caja con ícono y la activa se
 *   rellena de rojo, sin filete compartido. Es la que ya usaba el bloque
 *   values-cards con chips.
 *
 * Dibuja SOLO la tira de pestañas: el panel lo pone quien la use, que es
 * el que sabe qué mostrar. Se enlazan con `panelId` en cada pestaña.
 *
 * Cada pestaña es un <a> y no un <button>, por la convención de la
 * librería (ver la cabecera de AtomButton.vue). Como un ancla sin destino
 * no es interactiva por sí sola, se compensa a mano lo que un <button>
 * trae de fábrica: rol, foco, teclado y el cursor (este último en el CSS).
 * Además sigue el patrón ARIA de tablist: flechas para moverse, Inicio y
 * Fin para ir a los extremos, y el foco solo entra en la pestaña activa
 * (el resto queda fuera del tabulador).
 */
import { ref, computed } from 'vue';
import AtomIcon from '../atoms/AtomIcon.vue';
import { useDragScroll } from '../../composables/useDragScroll';

export interface TabItem {
  id: string;
  label: string;
  /** Nombre de AtomIcon. Solo la forma "cards" lo lleva en la lámina. */
  icon?: string;
  /** id del panel que abre esta pestaña, para enlazarlos con aria-controls. */
  panelId?: string;
}

const props = withDefaults(defineProps<{
  items: TabItem[];
  /** id de la pestaña activa. */
  modelValue?: string;
  variant?: 'underline' | 'vertical' | 'cards';
  /** Nombre del grupo para el lector de pantalla, ej. "Filtros". */
  ariaLabel?: string;
}>(), {
  items: () => [],
  variant: 'underline',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const root = ref<HTMLElement | null>(null);

/*
 * Con trackpad o pantalla táctil el carril ya se desplaza solo; con un ratón no
 * hay gesto horizontal, así que se puede arrastrar. En vertical no hace falta.
 */
useDragScroll(root);

const activeIndex = computed(() => props.items.findIndex((item) => item.id === props.modelValue));

const select = (id: string) => {
  if (id !== props.modelValue) emit('update:modelValue', id);
};

/**
 * El foco entra una sola vez en el grupo y dentro se mueve con las flechas
 * (patrón ARIA). Sin pestaña activa, la puerta de entrada es la primera.
 */
const isFocusable = (index: number) =>
  activeIndex.value === -1 ? index === 0 : index === activeIndex.value;

const focusTab = (index: number) => {
  const tabs = root.value?.querySelectorAll<HTMLElement>('.tabs__tab');
  tabs?.[index]?.focus();
};

const onKeydown = (event: KeyboardEvent, index: number) => {
  const vertical = props.variant === 'vertical';
  const siguiente = vertical ? 'ArrowDown' : 'ArrowRight';
  const anterior = vertical ? 'ArrowUp' : 'ArrowLeft';
  const total = props.items.length;

  let destino: number | null = null;
  if (event.key === siguiente) destino = (index + 1) % total;
  else if (event.key === anterior) destino = (index - 1 + total) % total;
  else if (event.key === 'Home') destino = 0;
  else if (event.key === 'End') destino = total - 1;
  else if (event.key === 'Enter' || event.key === ' ') {
    // Espacio, sin esto, desplaza la página.
    event.preventDefault();
    select(props.items[index].id);
    return;
  }

  if (destino === null) return;
  event.preventDefault();
  select(props.items[destino].id);
  focusTab(destino);
};
</script>

<template>
  <div ref="root" class="tabs" :class="`tabs--${variant}`">
    <div
      class="tabs__list"
      role="tablist"
      :aria-label="ariaLabel"
      :aria-orientation="variant === 'vertical' ? 'vertical' : undefined"
    >
      <a
        v-for="(item, index) in items"
        :key="item.id"
        class="tabs__tab"
        :class="{ 'is-active': item.id === modelValue }"
        role="tab"
        :tabindex="isFocusable(index) ? 0 : -1"
        :aria-selected="item.id === modelValue"
        :aria-controls="item.panelId"
        @click="select(item.id)"
        @keydown="onKeydown($event, index)"
      >
        <AtomIcon v-if="item.icon" :name="item.icon" :size="16" />
        {{ item.label }}
      </a>
    </div>
  </div>
</template>
