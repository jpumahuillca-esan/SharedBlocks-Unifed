<script setup lang="ts">
/**
 * FoundationsTypography — familias tipográficas, escala de tamaños y
 * pesos (ARCIS Design System, Foundations > Typography), para la
 * página de Documentación. Lista mantenida a mano en sincronía con
 * assets/styles/tokens.scss.
 */
const families = [
  { label: 'font-display / font-accent', cssVar: '--font-display', sample: 'Bricolage Grotesque' },
  { label: 'font-body', cssVar: '--font-body', sample: 'Inter' },
];

const scale = [
  { label: 'text-display', cssVar: '--text-display' },
  { label: 'text-giant', cssVar: '--text-giant' },
  { label: 'text-h1', cssVar: '--text-h1' },
  { label: 'text-h2', cssVar: '--text-h2' },
  { label: 'text-h3', cssVar: '--text-h3' },
  { label: 'text-h4', cssVar: '--text-h4' },
  { label: 'text-h5', cssVar: '--text-h5' },
  { label: 'text-h6', cssVar: '--text-h6' },
  { label: 'text-body-lg', cssVar: '--text-body-lg' },
  { label: 'text-body', cssVar: '--text-body' },
  { label: 'text-sm', cssVar: '--text-sm' },
  { label: 'text-xs', cssVar: '--text-xs' },
];

const weights = [
  { label: 'weight-light', cssVar: '--weight-light', value: 200 },
  { label: 'weight-regular', cssVar: '--weight-regular', value: 300 },
  { label: 'weight-medium', cssVar: '--weight-medium', value: 500 },
  { label: 'weight-semibold', cssVar: '--weight-semibold', value: 600 },
  { label: 'weight-bold', cssVar: '--weight-bold', value: 700 },
];
</script>

<template>
  <div class="ft">
    <div class="ft__group">
      <h4 class="ft__group-title">Familias</h4>
      <div class="ft__families">
        <div v-for="f in families" :key="f.cssVar" class="ft__family-row">
          <span class="ft__family-sample" :style="{ fontFamily: `var(${f.cssVar})` }">{{ f.sample }}</span>
          <span class="ft__token">{{ f.cssVar }}</span>
        </div>
      </div>
    </div>

    <div class="ft__group">
      <h4 class="ft__group-title">Escala</h4>
      <div class="ft__scale">
        <div v-for="s in scale" :key="s.cssVar" class="ft__scale-row">
          <span class="ft__token ft__token--fixed">{{ s.cssVar }}</span>
          <span class="ft__scale-sample" :style="{ fontSize: `var(${s.cssVar})` }">Aa Ee Ii</span>
        </div>
      </div>
    </div>

    <div class="ft__group">
      <h4 class="ft__group-title">Pesos</h4>
      <div class="ft__scale">
        <div v-for="w in weights" :key="w.cssVar" class="ft__scale-row">
          <span class="ft__token ft__token--fixed">{{ w.cssVar }} ({{ w.value }})</span>
          <span class="ft__scale-sample" :style="{ fontWeight: `var(${w.cssVar})`, fontSize: '18px' }">
            Postulaciones abiertas
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ft__group {
  margin-bottom: 28px;
}
.ft__group:last-child {
  margin-bottom: 0;
}
.ft__group-title {
  margin: 0 0 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--docs-text-subtle);
}
.ft__families {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ft__family-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
}
.ft__family-sample {
  font-size: 22px;
  color: var(--docs-text);
}
.ft__token {
  font-size: 11px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  color: var(--docs-text-subtle);
}
.ft__token--fixed {
  flex-shrink: 0;
  width: 130px;
}
.ft__scale {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ft__scale-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
}
.ft__scale-sample {
  color: var(--docs-text);
  line-height: 1.2;
}
</style>
