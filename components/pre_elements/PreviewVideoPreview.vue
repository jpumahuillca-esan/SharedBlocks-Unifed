<script setup lang="ts">
/**
 * PreviewVideoPreview — muestra MoleculeVideoPreview y MoleculeVideoList
 * con los ejemplos exactos de webunificada (Elementos > Video preview):
 * simple, con contenido (glass) y lista horizontal. Solo vista previa,
 * no se usa en bloques reales.
 */
import MoleculeVideoPreview from '../molecules/MoleculeVideoPreview.vue';
import MoleculeVideoList, { type VideoListItem } from '../molecules/MoleculeVideoList.vue';

const img1 = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop';
const img2 = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop';

const listItems: VideoListItem[] = [
  {
    thumb: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=300&auto=format&fit=crop',
    title: 'Cómo armar tu plan de negocio en 90 días',
    meta: '12:03 · Emprendimiento',
  },
  {
    thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&auto=format&fit=crop',
    title: 'Webinar: finanzas para no financieros',
    meta: '38:40 · Finanzas',
  },
  {
    thumb: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=300&auto=format&fit=crop',
    title: 'Egresados que transforman industrias',
    meta: '06:27 · Alumni',
  },
];
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Simple</span>
      <div class="preview-cap-480">
        <MoleculeVideoPreview
          :image="img1"
          duration="02:14"
          aria-label="Reproducir video: Conoce el campus ESAN"
        />
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Con contenido (glass)</span>
      <div class="preview-cap-480">
        <MoleculeVideoPreview
          variant="featured"
          :image="img2"
          duration="04:52"
          eyebrow="Vida universitaria"
          title="Testimonios: la vida en el campus ESAN"
          aria-label="Reproducir video: Testimonios, vida en el campus ESAN"
        />
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Lista horizontal</span>
      <div class="preview-cap-520">
        <MoleculeVideoList :items="listItems" />
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
.preview-cap-480 {
  width: 100%;
  max-width: 480px;
}
.preview-cap-520 {
  width: 100%;
  max-width: 520px;
}
</style>
