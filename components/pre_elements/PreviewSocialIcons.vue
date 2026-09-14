<script setup lang="ts">
/**
 * PreviewSocialIcons — muestra AtomSocialIcon para las 5 redes, en sus
 * dos variantes (Elementos > Iconos Sociales de webunificada): sobre
 * fondo claro y sobre fondo oscuro (footer, .social-icon--inverse).
 * Solo vista previa, no se usa en bloques reales.
 */
import AtomSocialIcon from '../atoms/AtomSocialIcon.vue';

const networks = ['facebook', 'instagram', 'linkedin', 'youtube', 'x'] as const;
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Sobre fondo claro</span>
      <div class="preview-row-wrap">
        <AtomSocialIcon v-for="network in networks" :key="network" :network="network" />
      </div>
    </div>

    <div class="preview-group preview-group--dark">
      <span class="preview-group__label">Sobre fondo oscuro (footer)</span>
      <div class="preview-row-wrap">
        <AtomSocialIcon v-for="network in networks" :key="network" :network="network" inverse />
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
.preview-group--dark {
  background: #212121;
  padding: 12px;
  border-radius: 8px;
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
