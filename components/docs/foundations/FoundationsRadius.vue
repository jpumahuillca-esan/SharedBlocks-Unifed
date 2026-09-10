<script setup lang="ts">
/**
 * FoundationsRadius — escala de border-radius (ARCIS Design System,
 * Foundations > Radius), para la página de Documentación. Lista
 * mantenida a mano en sincronía con assets/styles/tokens.scss.
 */
const scale = [
  { label: 'radius-xs', cssVar: '--radius-xs' },
  { label: 'radius-sm', cssVar: '--radius-sm' },
  { label: 'radius-md', cssVar: '--radius-md' },
  { label: 'radius-lg', cssVar: '--radius-lg' },
  { label: 'radius-xl', cssVar: '--radius-xl' },
  { label: 'radius-full', cssVar: '--radius-full' },
];
</script>

<template>
  <div class="fr__grid">
    <div v-for="r in scale" :key="r.cssVar" class="fr__item">
      <span class="fr__box" :style="{ borderRadius: `var(${r.cssVar})` }"></span>
      <span class="fr__token">{{ r.cssVar }}</span>
    </div>
  </div>
</template>

<style scoped>
.fr__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.fr__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.fr__box {
  width: 72px;
  height: 72px;
  background: #e3173e;
}
.fr__token {
  font-size: 11px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  color: var(--docs-text-subtle);
}
</style>
