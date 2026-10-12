<script setup lang="ts">
/**
 * PreviewCookieBanner — muestra MoleculeCookieBanner en modo `preview`
 * (Elementos > Cookie Banner de webunificada): variante oscura y clara.
 * Solo vista previa, no se usa en bloques reales.
 */
import MoleculeCookieBanner from '../molecules/MoleculeCookieBanner.vue';
import PreviewCodeSample from '../docs/PreviewCodeSample.vue';
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Oscuro</span>
      <div class="preview-stage">
        <PreviewCodeSample marker='<MoleculeCookieBanner @consent="onConsent" />' label="Aviso de cookies oscuro" block>
          <MoleculeCookieBanner preview />
        </PreviewCodeSample>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Claro</span>
      <div class="preview-stage">
        <PreviewCodeSample marker='<MoleculeCookieBanner variant="light"' label="Aviso de cookies claro" block>
          <MoleculeCookieBanner preview variant="light" />
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
.preview-stage {
  position: relative;
  overflow: hidden;
  height: 140px;
  border-radius: 8px;
  background: #f2f2f2;
}
</style>
