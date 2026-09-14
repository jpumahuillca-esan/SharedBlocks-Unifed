<script setup lang="ts">
/**
 * MoleculeAlert — Alert (ARCIS Design System, Elementos > Alerts).
 *
 * Vive en components/molecules/ y no en components/atoms/ porque está
 * compuesta de otro átomo (AtomIcon) — mismo criterio que MoleculeCard.
 *
 * Envuelve las clases .alert/.alert--* y .alert__* portadas en
 * assets/styles/elements/_alerts.scss. No redeclara estilos propios.
 *
 * Cada variante trae su propio ícono fijo, igual que en webunificada
 * (data-lucide="info"/"check-circle"/"alert-triangle"/"alert-circle" en
 * ui-kit.html sección Alerts) — no es una prop libre, es parte del
 * significado semántico de la variante.
 */
import { computed } from 'vue';
import AtomIcon from '../atoms/AtomIcon.vue';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const ICON_BY_VARIANT: Record<AlertVariant, string> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  error: 'alert-circle',
};

const props = withDefaults(defineProps<{
  variant?: AlertVariant;
  title?: string;
  text?: string;
}>(), {
  variant: 'info',
});

const classes = computed(() => ['alert', `alert--${props.variant}`]);
const icon = computed(() => ICON_BY_VARIANT[props.variant]);
</script>

<template>
  <div :class="classes">
    <AtomIcon :name="icon" :size="20" />
    <div class="alert__body">
      <span v-if="title" class="alert__title">{{ title }}</span>
      <span v-if="text" class="alert__text">{{ text }}</span>
      <slot />
    </div>
  </div>
</template>
