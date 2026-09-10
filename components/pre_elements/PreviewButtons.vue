<script setup lang="ts">
/**
 * PreviewButtons — muestra todas las variantes de AtomButton juntas
 * (Elementos > Botones de webunificada), para la pestaña "Elementos"
 * del sidebar del editor. Solo vista previa, no se usa en bloques reales.
 */
import AtomButton from '../atoms/AtomButton.vue';
import AtomIcon from '../atoms/AtomIcon.vue';

// "link" queda fuera de esta lista a propósito: en webunificada siempre
// lleva el ícono arrow-right + "Conocer más" (con animación de deslizar al
// hacer hover — ver .btn--link:hover svg en elements/_buttons.scss), no un
// texto genérico como los demás.
//
// "white" también queda fuera: es fondo blanco + texto rojo, pensada para
// ir SOBRE fondos rojos/oscuros (ver comentario en .btn--white de
// elements/_buttons.scss). Mostrarla acá, sobre el fondo blanco de la
// página, hace que el botón se vuelva invisible y solo quede el texto rojo
// flotando — no es que le falte contraste, es que este no es su contexto.
// Se muestra más abajo, en el grupo "Sobre fondo oscuro", donde sí tiene
// sentido.
const variants = [
  { variant: 'primary', label: 'primary' },
  { variant: 'secondary', label: 'secondary' },
  { variant: 'terciary', label: 'terciary' },
] as const;
</script>

<template>
  <div class="preview-stack">
    <div class="preview-group">
      <span class="preview-group__label">Variantes</span>
      <div class="preview-row-wrap">
        <AtomButton v-for="item in variants" :key="item.variant" :variant="item.variant">
          {{ item.label }}
        </AtomButton>
        <AtomButton variant="link">
          Conocer más
          <AtomIcon name="arrow-right" :size="16" />
        </AtomButton>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Tamaños</span>
      <div class="preview-row-wrap">
        <AtomButton variant="primary" size="sm">Pequeño</AtomButton>
        <AtomButton variant="primary" size="md">Mediano</AtomButton>
        <AtomButton variant="primary" size="lg">Grande</AtomButton>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Estados</span>
      <div class="preview-row-wrap">
        <AtomButton variant="primary">Normal</AtomButton>
        <AtomButton variant="primary" disabled>Deshabilitado</AtomButton>
        <AtomButton variant="secondary" icon aria-label="Buscar">
          <AtomIcon name="search" :size="16" />
        </AtomButton>
      </div>
    </div>

    <div class="preview-group preview-group--dark">
      <span class="preview-group__label">Sobre fondo oscuro</span>
      <div class="preview-row-wrap">
        <AtomButton variant="white">CTA principal</AtomButton>
        <AtomButton variant="secondary" negative>Ver programas</AtomButton>
        <AtomButton variant="link" negative>
          Conocer más
          <AtomIcon name="arrow-right" :size="16" />
        </AtomButton>
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
