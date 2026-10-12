<script setup lang="ts">
/**
 * PreviewLoaders — muestra AtomSpinner/AtomDotsLoader juntos (Elementos >
 * Loaders/Spinners de webunificada): spinner en 3 tamaños, dots-loader y
 * botón en estado de carga. Solo vista previa, no se usa en bloques reales.
 */
import AtomSpinner from '../atoms/AtomSpinner.vue';
import AtomDotsLoader from '../atoms/AtomDotsLoader.vue';
import AtomButton from '../atoms/AtomButton.vue';
import PreviewCodeSample from '../docs/PreviewCodeSample.vue';
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Spinner</span>
      <div class="preview-row-wrap">
        <PreviewCodeSample marker='<AtomSpinner size="sm" />' label="Spinner pequeño">
          <AtomSpinner size="sm" />
        </PreviewCodeSample>
        <PreviewCodeSample marker="<AtomSpinner />" label="Spinner mediano">
          <AtomSpinner />
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomSpinner size="lg" />' label="Spinner grande">
          <AtomSpinner size="lg" />
        </PreviewCodeSample>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Dots &amp; botón en carga</span>
      <div class="preview-row-wrap">
        <PreviewCodeSample marker="<AtomDotsLoader />" label="Loader de puntos">
          <AtomDotsLoader />
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomButton variant="primary" disabled>' label="Botón en estado de carga">
        <AtomButton variant="primary" disabled>
          <AtomSpinner size="sm" inverse />
          Enviando…
        </AtomButton>
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
  gap: 16px;
}
</style>
