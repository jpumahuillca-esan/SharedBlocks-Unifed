<script setup lang="ts">
/**
 * PreviewPostCard — muestra MoleculePostCard con los ejemplos exactos
 * de webunificada (Elementos > Post Card): estándar (2 cards en grid) y
 * noticia (etiqueta sobre imagen, ancho acotado). Solo vista previa, no
 * se usa en bloques reales.
 */
import MoleculePostCard from '../molecules/MoleculePostCard.vue';

const img1 = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop';
const img2 = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop';
const img3 = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop';
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Estándar</span>
      <!-- Igual que .demo-grid en webunificada: auto-fit + 1fr reparte
           varios ítems en columnas de ~260px+ cada una. -->
      <div class="preview-demo-grid">
        <MoleculePostCard
          :image="img1"
          eyebrow="Liderazgo"
          title="5 claves para liderar equipos remotos en el 2026"
          excerpt="Cómo mantener la cohesión y productividad de equipos distribuidos en distintas zonas horarias."
          published-date="18 jul 2026"
          reading-time="6 min de lectura"
        />
        <MoleculePostCard
          :image="img2"
          eyebrow="Finanzas"
          title="Cómo leer el entorno macroeconómico antes de invertir"
          excerpt="Un marco práctico para decisiones de inversión en contextos de alta volatilidad."
          published-date="10 jul 2026"
          reading-time="8 min de lectura"
        />
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Noticia (etiqueta sobre imagen)</span>
      <div class="preview-demo-grid">
        <MoleculePostCard
          variant="news"
          :image="img3"
          tag="Actualidad"
          date="09/07/2026"
          title="ESAN acompaña logro de escolar peruano premiado en mundial de robótica en Estados Unidos"
          class="preview-news-card"
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
.preview-demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}
.preview-news-card {
  max-width: 320px;
}
</style>
