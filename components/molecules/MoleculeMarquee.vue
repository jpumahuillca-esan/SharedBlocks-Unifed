<script setup lang="ts">
/**
 * MoleculeMarquee — franja de desplazamiento continuo (ARCIS Design
 * System, Elementos > Marquee) — reconocimientos, alianzas o cifras
 * clave.
 *
 * Vive en components/molecules/ y no en components/atoms/ porque
 * compone el átomo AtomIcon (ícono opcional por ítem) — mismo criterio
 * que MoleculeBreadcrumb.
 *
 * Envuelve las clases .marquee, .marquee__track, .marquee__item y
 * .marquee--dark/.marquee--brand portadas en
 * assets/styles/elements/_marquee.scss. No redeclara estilos propios.
 *
 * El loop infinito necesita el mismo set de ítems repetido 2 veces
 * dentro de ".marquee__track" (ver nota en _marquee.scss) — acá se
 * duplica automáticamente, el consumidor solo pasa un set una vez.
 */
import { computed } from 'vue';
import AtomIcon from '../atoms/AtomIcon.vue';

export interface MarqueeItem {
  label: string;
  icon?: string;
}

const props = withDefaults(defineProps<{
  items: MarqueeItem[];
  variant?: 'light' | 'dark' | 'brand';
}>(), {
  variant: 'light',
});

const classes = computed(() => [
  'marquee',
  props.variant !== 'light' ? `marquee--${props.variant}` : null,
]);

const trackItems = computed(() => [...props.items, ...props.items]);
</script>

<template>
  <div :class="classes">
    <div class="marquee__track">
      <span v-for="(item, index) in trackItems" :key="index" class="marquee__item">
        <AtomIcon v-if="item.icon" :name="item.icon" :size="18" />
        {{ item.label }}
      </span>
    </div>
  </div>
</template>
