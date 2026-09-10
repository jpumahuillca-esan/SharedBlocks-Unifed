<script setup lang="ts">
/**
 * FoundationsSpacing — escala de espaciado de 10 pasos (ARCIS Design
 * System, Foundations > Spacing), para la página de Documentación.
 * Lista mantenida a mano en sincronía con assets/styles/tokens.scss.
 */
const scale = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({
  label: `space-${n}`,
  cssVar: `--space-${n}`,
}));
</script>

<template>
  <div class="fs__scale">
    <div v-for="s in scale" :key="s.cssVar" class="fs__row">
      <span class="fs__token">{{ s.cssVar }}</span>
      <span class="fs__bar" :style="{ width: `var(${s.cssVar})` }"></span>
    </div>
  </div>
</template>

<style scoped>
.fs__scale {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.fs__row {
  display: flex;
  align-items: center;
  gap: 16px;
}
.fs__token {
  flex-shrink: 0;
  width: 90px;
  font-size: 11px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  color: var(--docs-text-subtle);
}
.fs__bar {
  height: 16px;
  border-radius: 3px;
  background: #e3173e;
}
</style>
