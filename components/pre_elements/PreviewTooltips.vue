<script setup lang="ts">
/**
 * PreviewTooltips — muestra AtomTooltip en los 3 usos que documenta
 * webunificada (Elementos > Tooltips): sobre un botón-ícono, sobre texto
 * inline (arriba, por defecto) y sobre texto inline (abajo). Solo vista
 * previa, no se usa en bloques reales.
 *
 * En este preview el tooltip no se ve solo, hay que pasar el mouse (o
 * enfocar con tab) sobre cada elemento para que aparezca — es CSS puro,
 * igual que en la guía viva.
 */
import AtomTooltip from '../atoms/AtomTooltip.vue';
import AtomIcon from '../atoms/AtomIcon.vue';
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Pasa el mouse o navega con Tab</span>
      <div class="preview-row-wrap">
        <AtomTooltip as="button" text="Copiar enlace" class="btn btn--secondary btn--icon" aria-label="Copiar enlace">
          <AtomIcon name="link" :size="16" />
        </AtomTooltip>

        <AtomTooltip text="Programa acreditado internacionalmente" class="preview-tooltip-text">
          MBA Part-Time
        </AtomTooltip>

        <AtomTooltip text="18 meses, modalidad híbrida" position="bottom" class="preview-tooltip-text">
          Duración del programa
        </AtomTooltip>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 16px 48px;
}
.preview-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  gap: 24px;
}
.preview-tooltip-text {
  border-bottom: 1px dashed var(--arcis-color-text-disabled);
  cursor: help;
}
</style>
