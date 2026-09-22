<script setup lang="ts">
/**
 * MoleculeCollapse — panel expandible individual (ARCIS Design System,
 * Elementos > Collapse), pieza base de un acordeón de FAQs.
 *
 * Vive en components/molecules/ y no en components/atoms/ porque
 * compone el átomo AtomIcon (flecha "chevron-down" fija) — mismo
 * criterio que MoleculeAlert/MoleculeCookieBanner.
 *
 * Envuelve ".collapse"/".collapse__trigger"/".collapse__panel"/
 * ".collapse__panel-inner"/".collapse__body" portadas en
 * assets/styles/elements/_collapse.scss. No redeclara estilos propios.
 *
 * Cada instancia es independiente (abrir una no cierra las demás).
 * Varias seguidas se apilan como tarjetas sueltas y la separación entre
 * ellas la pone el CSS (".collapse + .collapse"), sin necesidad de armar
 * un componente "acordeón" aparte.
 *
 * Con `inverse`, la versión para fondo oscuro de la lámina: el panel se
 * queda sin fondo propio y se apoya en el color de la sección.
 *
 * El disparador es un <a>, no un <button>, por la convención de la
 * librería (ver la cabecera de AtomButton.vue). Como un ancla sin
 * destino no es interactiva por sí sola, se compensa a mano lo que un
 * <button> trae de fábrica: role, tabindex, Enter/Espacio y el cursor
 * (este último en el CSS).
 */
import { ref, computed, useId } from 'vue';
import AtomIcon from '../atoms/AtomIcon.vue';

const props = withDefaults(defineProps<{
  title: string;
  defaultOpen?: boolean;
  /** Versión para fondo oscuro: sin fondo propio, borde y texto en claro. */
  inverse?: boolean;
}>(), {
  defaultOpen: false,
  inverse: false,
});

const isOpen = ref(props.defaultOpen);
/* Identificador estable en servidor y cliente, para enlazar botón y panel. */
const panelId = `collapse-panel-${useId()}`;

const toggle = () => {
  isOpen.value = !isOpen.value;
};

/* Espacio sin preventDefault desplazaría la página. */
const onKeydown = (event: KeyboardEvent) => {
  event.preventDefault();
  toggle();
};

const classes = computed(() => [
  'collapse',
  'collapse--arcis',
  props.inverse ? 'collapse--inverse' : null,
  isOpen.value ? 'is-open' : null,
]);
</script>

<template>
  <div :class="classes">
    <a
      class="collapse__trigger"
      role="button"
      tabindex="0"
      :aria-expanded="isOpen"
      :aria-controls="panelId"
      @click="toggle"
      @keydown.enter="onKeydown"
      @keydown.space="onKeydown"
    >
      {{ title }}
      <AtomIcon name="chevron-down" :size="24" />
    </a>
    <div class="collapse__panel" :id="panelId">
      <div class="collapse__panel-inner">
        <p class="collapse__body">
          <slot />
        </p>
      </div>
    </div>
  </div>
</template>
