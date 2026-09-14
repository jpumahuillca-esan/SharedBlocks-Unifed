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
 * Cada instancia es independiente (abrir una no cierra las demás),
 * igual que initCollapse() en webunificada. Varias instancias seguidas
 * (ej. dentro de un v-for) se renderizan como hermanas directas, por lo
 * que el truco visual de ".collapse + .collapse" (sin doble borde entre
 * paneles apilados) funciona solo con ponerlas una junto a otra, sin
 * necesidad de armar un componente "acordeón" aparte.
 */
import { ref, computed } from 'vue';
import AtomIcon from '../atoms/AtomIcon.vue';

const props = withDefaults(defineProps<{
  title: string;
  defaultOpen?: boolean;
}>(), {
  defaultOpen: false,
});

const isOpen = ref(props.defaultOpen);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const classes = computed(() => ['collapse', 'collapse--arcis', isOpen.value ? 'is-open' : null]);
</script>

<template>
  <div :class="classes">
    <button type="button" class="collapse__trigger" :aria-expanded="isOpen" @click="toggle">
      {{ title }}
      <AtomIcon name="chevron-down" :size="18" />
    </button>
    <div class="collapse__panel">
      <div class="collapse__panel-inner">
        <p class="collapse__body">
          <slot />
        </p>
      </div>
    </div>
  </div>
</template>
