<script setup lang="ts">
/**
 * FoundationsBorders — anchos y colores de borde (ARCIS Design System,
 * Foundations > Borders), para la página de Documentación. Lista
 * mantenida a mano en sincronía con assets/styles/tokens.scss.
 */
const widths = [
  { label: 'border-width-sm', cssVar: '--border-width-sm' },
  { label: 'border-width-md', cssVar: '--border-width-md' },
];

const colors = [
  { label: 'border-color-light', cssVar: '--border-color-light' },
  { label: 'border-color-dark', cssVar: '--border-color-dark' },
];
</script>

<template>
  <div class="fb">
    <div class="fb__group">
      <h4 class="fb__group-title">Anchos</h4>
      <div class="fb__grid">
        <div v-for="w in widths" :key="w.cssVar" class="fb__item">
          <span class="fb__box" :style="{ borderWidth: `var(${w.cssVar})`, borderColor: 'var(--arcis-color-global-main)', borderStyle: 'solid' }"></span>
          <span class="fb__token">{{ w.cssVar }}</span>
        </div>
      </div>
    </div>

    <div class="fb__group">
      <h4 class="fb__group-title">Colores</h4>
      <div class="fb__grid">
        <div v-for="c in colors" :key="c.cssVar" class="fb__item">
          <span class="fb__box" :style="{ borderWidth: '2px', borderColor: `var(${c.cssVar})`, borderStyle: 'solid' }"></span>
          <span class="fb__token">{{ c.cssVar }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fb__group {
  margin-bottom: 24px;
}
.fb__group:last-child {
  margin-bottom: 0;
}
.fb__group-title {
  margin: 0 0 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--docs-text-subtle);
}
.fb__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.fb__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.fb__box {
  /* fijo blanco a propósito: border-color-dark es un gris medio,
     perdería contraste sobre un fondo oscuro que también cambie */
  width: 72px;
  height: 72px;
  border-radius: 8px;
  background: #ffffff;
}
.fb__token {
  font-size: 11px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  color: var(--docs-text-subtle);
}
</style>
