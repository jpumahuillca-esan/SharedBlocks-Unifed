<script setup lang="ts">
/**
 * FoundationsShadows — escala de sombras (ARCIS Design System,
 * Foundations > Shadows), para la página de Documentación. Lista
 * mantenida a mano en sincronía con assets/styles/tokens.scss.
 */
const scale = [
  { label: 'shadow-sm', cssVar: '--shadow-sm' },
  { label: 'shadow-md', cssVar: '--shadow-md' },
  { label: 'shadow-lg', cssVar: '--shadow-lg' },
];
</script>

<template>
  <div class="fsh__grid">
    <div v-for="s in scale" :key="s.cssVar" class="fsh__item">
      <span class="fsh__box" :style="{ boxShadow: `var(${s.cssVar})` }"></span>
      <span class="fsh__token">{{ s.cssVar }}</span>
    </div>
  </div>
</template>

<style scoped>
.fsh__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}
.fsh__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.fsh__box {
  /* fijo blanco a propósito: las sombras (rgba negro) se calibraron
     para una superficie clara, sobre fondo oscuro perderían contraste */
  width: 96px;
  height: 72px;
  border-radius: 8px;
  background: #ffffff;
}
.fsh__token {
  font-size: 11px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  color: var(--docs-text-subtle);
}
</style>
