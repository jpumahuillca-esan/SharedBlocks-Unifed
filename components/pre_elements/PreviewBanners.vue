<script setup lang="ts">
/**
 * PreviewBanners — muestra MoleculeBanner con los ejemplos exactos de
 * webunificada (Elementos > Banners): estándar (brand, outline) y con
 * imagen (default, split, con eyebrow). Solo vista previa, no se usa
 * en bloques reales.
 */
import MoleculeBanner from '../molecules/MoleculeBanner.vue';
import AtomButton from '../atoms/AtomButton.vue';
import AtomIcon from '../atoms/AtomIcon.vue';

const img1 = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop';
const img2 = 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?q=80&w=800&auto=format&fit=crop';
const img3 = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop';
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Estándar</span>
      <div class="preview-column-wrap">
        <MoleculeBanner
          variant="brand"
          eyebrow="Admisión 2026-I"
          title="Las postulaciones ya están abiertas"
          text="Asegura tu vacante antes del 30 de agosto y accede a becas por pronto pago."
        >
          <template #actions>
            <AtomButton variant="terciary">Postula ahora</AtomButton>
          </template>
        </MoleculeBanner>

        <MoleculeBanner
          variant="outline"
          icon="file-down"
          title="Descarga el brochure del programa"
          text="Malla curricular, plana docente y modalidades de pago en un solo PDF."
        >
          <template #actions>
            <AtomButton variant="link" href="#">
              Descargar
              <AtomIcon name="arrow-right" :size="16" />
            </AtomButton>
          </template>
        </MoleculeBanner>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Con imagen</span>
      <div class="preview-image-grid">
        <MoleculeBanner
          variant="image"
          :image="img1"
          image-alt="Egresados celebrando su graduación con vista a la ciudad"
          title="Vida universitaria"
          text="Carreras de ciencias administrativas"
        />
        <MoleculeBanner
          variant="image-split"
          :image="img2"
          image-alt="Directivo frente a un edificio corporativo"
          title="ESAN Graduate School of Business"
          text="MBAs, Maestrías, Doctorados y programas especializados"
        />
        <MoleculeBanner
          variant="image"
          :image="img3"
          image-alt="Equipo planificando con notas adhesivas en una pizarra"
          eyebrow="Maestrías"
          title="Management"
          text="Carreras de ciencias administrativas"
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
}
.preview-image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
</style>
