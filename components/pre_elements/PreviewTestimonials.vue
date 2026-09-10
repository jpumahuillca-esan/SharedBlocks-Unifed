<script setup lang="ts">
/**
 * PreviewTestimonials — muestra MoleculeTestimonial con los ejemplos
 * exactos de webunificada (Elementos > Testimonials): estándar y con
 * video. Solo vista previa, no se usa en bloques reales.
 */
import MoleculeTestimonial from '../molecules/MoleculeTestimonial.vue';

const authorPhoto = 'https://i.pravatar.cc/96?img=15';
const videoImage = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop';
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Estándar</span>
      <div class="preview-demo-grid">
        <MoleculeTestimonial
          :author-avatar="authorPhoto"
          quote="El MBA de ESAN me dio las herramientas y la red de contactos para liderar la expansión regional de mi empresa."
          author-name="Renzo Villalobos"
          author-role="MBA 2023 · Gerente Regional"
        />
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Con video</span>
      <div class="preview-column-wrap">
        <MoleculeTestimonial
          variant="video"
          :image="videoImage"
          image-alt="Alberto Echevarria"
          author-name="Alberto Echevarria"
          author-role="Egresado · Administración y Marketing"
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
/* Igual que .demo-grid en webunificada (main.css): con un solo ítem,
   auto-fit + 1fr hace que esa columna ocupe todo el ancho disponible —
   así se ve en la propia guía viva. En una grilla real con varios
   testimonios, cada card quedaría en ~260px+ por columna. */
.preview-demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}
.preview-column-wrap {
  align-self: flex-start;
  width: 280px;
  max-width: 100%;
}
</style>
