<script setup lang="ts">
/**
 * PreviewBadges — muestra todas las variantes de AtomBadge y AtomEyebrow
 * juntas (Elementos > "Badges & Eyebrow" de webunificada, es una sola
 * sección ahí, por eso van combinados acá también). Solo vista previa.
 */
import AtomBadge from '../atoms/AtomBadge.vue';
import AtomEyebrow from '../atoms/AtomEyebrow.vue';

const badgeVariants = [
  { variant: 'brand', label: 'Nuevo' },
  { variant: 'brand-solid', label: 'Conferencia informativa' },
  { variant: 'neutral', label: 'Presencial' },
  { variant: 'outline', label: 'Texto' },
  { variant: 'info', label: 'Informativo' },
  { variant: 'success', label: 'Acreditado' },
  { variant: 'warning', label: 'Últimas vacantes' },
  { variant: 'error', label: 'Cerrado' },
] as const;

/* En el Figma, la fila de esquinas rectas muestra la sólida y las de feedback. */
const fixedVariants = [
  { variant: 'brand-solid', label: 'Texto' },
  { variant: 'info', label: 'Texto' },
  { variant: 'success', label: 'Texto' },
  { variant: 'warning', label: 'Texto' },
  { variant: 'error', label: 'Texto' },
] as const;
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Eyebrow</span>
      <div class="preview-row-wrap">
        <AtomEyebrow variant="brand">Maestrías</AtomEyebrow>
        <AtomEyebrow variant="neutral">Actualidad ESAN</AtomEyebrow>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Badge</span>
      <div class="preview-row-wrap">
        <AtomBadge v-for="item in badgeVariants" :key="item.variant" :variant="item.variant">
          {{ item.label }}
        </AtomBadge>
      </div>
    </div>

    <!-- "Badges fixed" del Figma: mismo color, más alta y con una sola esquina redondeada, la inferior derecha. -->
    <div class="preview-group">
      <span class="preview-group__label">Badge fixed (esquina inferior derecha redondeada)</span>
      <div class="preview-row-wrap">
        <AtomBadge v-for="item in fixedVariants" :key="item.variant" :variant="item.variant" fixed>
          {{ item.label }}
        </AtomBadge>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
}
.preview-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.preview-group__label {
  font-size: 10px;
  font-family: monospace;
  color: #999;
  text-transform: uppercase;
}
.preview-row-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
</style>
