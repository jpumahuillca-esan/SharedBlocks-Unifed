<script setup lang="ts">
/**
 * PreviewCollapse — muestra MoleculeCollapse en sus dos variantes
 * (Elementos > Collapse): sobre fondo claro y sobre fondo oscuro, con
 * un panel cerrado y otro abierto en cada una, como la lámina del
 * Figma. Solo vista previa, no se usa en bloques reales.
 */
import MoleculeCollapse from '../molecules/MoleculeCollapse.vue';
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Claro</span>
      <div class="preview-column-wrap">
        <MoleculeCollapse title="¿Qué documentos necesito para postular?">
          Copia de DNI, grado de bachiller o título profesional, CV documentado y dos cartas de recomendación.
        </MoleculeCollapse>
        <MoleculeCollapse title="¿Hay financiamiento disponible?" default-open>
          Sí, contamos con líneas de financiamiento propio y convenios con entidades bancarias. También puedes
          acceder al programa de becas por mérito académico.
        </MoleculeCollapse>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Sobre fondo oscuro</span>
      <div class="preview-column-wrap preview-column-wrap--dark">
        <MoleculeCollapse title="¿Qué documentos necesito para postular?" inverse>
          Copia de DNI, grado de bachiller o título profesional, CV documentado y dos cartas de recomendación.
        </MoleculeCollapse>
        <MoleculeCollapse title="¿Hay financiamiento disponible?" inverse default-open>
          Sí, contamos con líneas de financiamiento propio y convenios con entidades bancarias. También puedes
          acceder al programa de becas por mérito académico.
        </MoleculeCollapse>
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
  max-width: 480px;
}
/* La variante inversa no trae fondo propio: lo pone la sección que la contiene. */
.preview-column-wrap--dark {
  padding: 20px;
  border-radius: 8px;
  background: #000;
}
</style>
