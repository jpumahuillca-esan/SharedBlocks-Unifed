<script setup lang="ts">
/**
 * PreviewEventCard — muestra MoleculeEventCard con los ejemplos exactos
 * de webunificada (Elementos > Event Card): horizontal y con imagen.
 * Solo vista previa, no se usa en bloques reales.
 */
import MoleculeEventCard from '../molecules/MoleculeEventCard.vue';

const eventImage = 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=600&auto=format&fit=crop';
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Horizontal</span>
      <div class="preview-column-wrap">
        <MoleculeEventCard
          day="14"
          month="Ago"
          title="Open House MBA Part-Time"
          time="7:00 p.m."
          location="Campus Surco"
          cta-label="Inscribirme"
        />
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Con imagen</span>
      <div class="preview-demo-grid">
        <MoleculeEventCard
          variant="media"
          :image="eventImage"
          day="02"
          month="Jul"
          tag="Conferencia informativa"
          title="Inicia tu Maestría con el PADE Internacional en Gestión del Talento Humano de ESAN"
          class="preview-media-card"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px;
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
.preview-column-wrap {
  align-self: flex-start;
  width: 100%;
}
.preview-demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}
.preview-media-card {
  max-width: 320px;
}
</style>
