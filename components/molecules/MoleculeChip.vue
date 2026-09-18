<script setup lang="ts">
/**
 * MoleculeChip — Chip/Tag (ARCIS Design System, Elementos > Chips/Tags).
 *
 * Vive en components/molecules/ y no en components/atoms/ porque, en su
 * variante removible, compone otro átomo (AtomIcon, para el "x" fijo del
 * botón de quitar) — mismo criterio que MoleculeAlert.
 *
 * Envuelve las clases .chip/.is-active/.chip__remove portadas en
 * assets/styles/elements/_chips.scss. No redeclara estilos propios.
 *
 * Dos variantes, cada una con su propia etiqueta HTML real (igual que
 * webunificada, no es solo un cambio de clase):
 * - "filter" (default): chip clickeable, con estado is-active (selección
 *   única en un grupo de filtros).
 * - "removable": <span class="chip"> con el texto + un control aparte con el
 *   ícono "x", para filtros aplicados.
 *
 * Los dos controles van como <a> —nunca <button>— por la decisión de proyecto
 * que documenta AtomButton (criterio de posicionamiento). El kit los dibuja
 * como <button>; aquí se cambió la etiqueta y se compensa a mano lo que un
 * <button> da de fábrica: rol, foco, y Enter y Espacio.
 */
import { computed } from 'vue';
import AtomIcon from '../atoms/AtomIcon.vue';

const props = withDefaults(defineProps<{
  removable?: boolean;
  /** Solo variante "filter": si este chip está seleccionado. */
  active?: boolean;
  /** Solo variante "removable": aria-label del botón de quitar, ej. "Quitar filtro Finanzas". */
  removeLabel?: string;
}>(), {
  removable: false,
  active: false,
  removeLabel: 'Quitar filtro',
});

const emit = defineEmits<{
  click: [];
  remove: [];
}>();

const classes = computed(() => ['chip', props.active ? 'is-active' : null]);

/**
 * Un <button> se activa con Enter y Espacio; un <a> sin href, con ninguna de
 * las dos. Se atienden a mano, igual que hace AtomButton.
 */
const onKeydown = (event: KeyboardEvent, action: 'click' | 'remove') => {
  if (event.key !== 'Enter' && event.key !== ' ') return;

  // Espacio, sin esto, desplaza la página.
  event.preventDefault();

  // Cada emisión va por su nombre literal: `emit` está tipado por evento y no
  // acepta una variable que podría ser cualquiera de los dos.
  if (action === 'click') emit('click');
  else emit('remove');
};
</script>

<template>
  <a
    v-if="!removable"
    :class="classes"
    role="button"
    tabindex="0"
    :aria-pressed="active ? 'true' : 'false'"
    @click="emit('click')"
    @keydown="onKeydown($event, 'click')"
  >
    <slot />
  </a>
  <span v-else :class="classes">
    <slot />
    <a
      class="chip__remove"
      role="button"
      tabindex="0"
      :aria-label="removeLabel"
      @click="emit('remove')"
      @keydown="onKeydown($event, 'remove')"
    >
      <AtomIcon name="x" :size="14" />
    </a>
  </span>
</template>
