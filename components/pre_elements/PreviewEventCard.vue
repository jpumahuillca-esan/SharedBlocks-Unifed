<script setup lang="ts">
/**
 * PreviewEventCard — muestra MoleculeEventCard en sus dos formatos y en
 * las dos formas que toma cada uno (Elementos > Event Card), siguiendo
 * la lámina del Figma: sin imagen en fila y apilada, y con imagen en
 * vertical y con la foto al costado.
 *
 * El apilado se muestra con la prop `layout="stacked"` porque en una
 * guía no se puede angostar la columna; en uso real lo hace solo cuando
 * la tarjeta se queda sin ancho.
 *
 * Solo vista previa, no se usa en bloques reales.
 */
import MoleculeEventCard from '../molecules/MoleculeEventCard.vue';

const eventImage = 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=600&auto=format&fit=crop';
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Sin imagen · en fila</span>
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
      <span class="preview-group__label">Sin imagen · apilada (poco ancho)</span>
      <div class="preview-column-wrap preview-column-wrap--narrow">
        <MoleculeEventCard
          layout="stacked"
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
      <span class="preview-group__label">Con imagen · vertical</span>
      <div class="preview-demo-grid">
        <MoleculeEventCard
          variant="media"
          :image="eventImage"
          day="02"
          month="Jul"
          :badges="['Texto', 'Texto']"
          title="Inicia tu Maestría con el PADE Internacional en Gestión del Talento Humano de ESAN"
          class="preview-media-card"
        />
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Con imagen · con la foto al costado</span>
      <div class="preview-column-wrap">
        <MoleculeEventCard
          variant="media"
          layout="row"
          :image="eventImage"
          day="02"
          month="Jul"
          :badges="['Texto', 'Texto']"
          title="Inicia tu Maestría con el PADE Internacional en Gestión del Talento Humano de ESAN"
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
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 640px;
}
/* El ancho de un teléfono, para ver la tarjeta apilada como en la lámina. */
.preview-column-wrap--narrow {
  max-width: 360px;
}
.preview-demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  max-width: 640px;
}
.preview-media-card {
  max-width: 320px;
}
</style>
