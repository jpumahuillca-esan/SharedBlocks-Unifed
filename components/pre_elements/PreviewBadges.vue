<script setup lang="ts">
/**
 * PreviewBadges — muestra todas las variantes de AtomBadge y AtomEyebrow
 * juntas (Elementos > "Badges & Eyebrow" de webunificada, es una sola
 * sección ahí, por eso van combinados acá también). Solo vista previa.
 */
import AtomBadge from '../atoms/AtomBadge.vue';
import AtomEyebrow from '../atoms/AtomEyebrow.vue';
import PreviewCodeSample from '../docs/PreviewCodeSample.vue';

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

const badgeMarker = (variant: string, fixed = false) =>
  fixed ? `<AtomBadge variant="${variant}" fixed>` : `<AtomBadge variant="${variant}">`;

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
        <PreviewCodeSample marker='<AtomEyebrow variant="brand">' label="Eyebrow de marca">
          <AtomEyebrow variant="brand">Maestrías</AtomEyebrow>
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomEyebrow variant="neutral">' label="Eyebrow neutro">
          <AtomEyebrow variant="neutral">Actualidad ESAN</AtomEyebrow>
        </PreviewCodeSample>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Badge</span>
      <div class="preview-row-wrap">
        <PreviewCodeSample
          v-for="item in badgeVariants"
          :key="item.variant"
          :marker="badgeMarker(item.variant)"
          :label="`Badge ${item.variant}`"
        >
          <AtomBadge :variant="item.variant">{{ item.label }}</AtomBadge>
        </PreviewCodeSample>
      </div>
    </div>

    <!-- "Badges fixed" del Figma: mismo color, más alta y con una sola esquina redondeada, la inferior derecha. -->
    <div class="preview-group">
      <span class="preview-group__label">Badge fixed (esquina inferior derecha redondeada)</span>
      <div class="preview-row-wrap">
        <PreviewCodeSample
          v-for="item in fixedVariants"
          :key="item.variant"
          :marker="badgeMarker(item.variant, true)"
          :label="`Badge fijo ${item.variant}`"
        >
          <AtomBadge :variant="item.variant" fixed>{{ item.label }}</AtomBadge>
        </PreviewCodeSample>
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
