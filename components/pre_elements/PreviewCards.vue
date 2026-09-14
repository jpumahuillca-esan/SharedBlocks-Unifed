<script setup lang="ts">
/**
 * PreviewCards — muestra las 3 variantes de MoleculeCard juntas
 * (Elementos > Cards de webunificada), con los mismos ejemplos y la
 * misma cantidad de cards por subsección que la guía viva (2 cards
 * estándar, 3 cards de servicio, 1 card con imagen — incluyendo el
 * eyebrow "MBA" que esa card sí trae en el HTML real). El layout usa
 * ".demo-grid" (auto-fit + minmax), igual que webunificada. Solo vista
 * previa, no se usa en bloques reales.
 */
import MoleculeCard from '../molecules/MoleculeCard.vue';
import AtomEyebrow from '../atoms/AtomEyebrow.vue';
import AtomButton from '../atoms/AtomButton.vue';
import AtomIcon from '../atoms/AtomIcon.vue';

const placeholderImage = 'https://placehold.co/600x450?text=Imagen';
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Card</span>
      <div class="preview-demo-grid">
        <MoleculeCard
          variant="default"
          :image="placeholderImage"
          title="Centro de Innovación y Emprendimiento"
          text="Investigación aplicada al servicio de la comunidad empresarial peruana."
        >
          <template #eyebrow>
            <AtomEyebrow>Investigación</AtomEyebrow>
          </template>
          <template #actions>
            <AtomButton variant="link">
              Leer más
              <AtomIcon name="arrow-right" :size="16" />
            </AtomButton>
          </template>
        </MoleculeCard>
        <MoleculeCard
          variant="default"
          :image="placeholderImage"
          title="Convenios internacionales"
          text="Doble titulación con escuelas de negocio acreditadas globalmente."
        >
          <template #eyebrow>
            <AtomEyebrow>Alianzas</AtomEyebrow>
          </template>
          <template #actions>
            <AtomButton variant="link">
              Leer más
              <AtomIcon name="arrow-right" :size="16" />
            </AtomButton>
          </template>
        </MoleculeCard>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Card servicio (numeración de proceso)</span>
      <div class="preview-demo-grid">
        <MoleculeCard
          variant="service"
          number="01"
          title="Postula"
          text="Completa el formulario de admisión y adjunta tu documentación académica."
        />
        <MoleculeCard
          variant="service"
          number="02"
          title="Evaluación"
          text="Rinde la entrevista y la evaluación de admisión con el comité académico."
        />
        <MoleculeCard
          variant="service"
          number="03"
          title="Matrícula"
          text="Confirma tu vacante y realiza el proceso de matrícula en línea."
        />
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Card con imagen</span>
      <div class="preview-demo-grid">
        <MoleculeCard
          variant="image"
          :image="placeholderImage"
          title="Maestría en Business Administration"
          text="Formación gerencial integral con enfoque global."
        >
          <template #eyebrow>
            <AtomEyebrow>MBA</AtomEyebrow>
          </template>
        </MoleculeCard>
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
/* Igual que .demo-grid en webunificada (main.css): auto-fit + minmax
   reparte varias cards en columnas de ~260px+ cada una, y con una sola
   card esa columna ocupa todo el ancho disponible. */
.preview-demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}
</style>
