<script setup lang="ts">
/**
 * PreviewButtons — todas las variantes de AtomButton juntas, ordenadas como
 * las láminas del Figma de arcis-2 ("Variantes", "Button Icon", "Button Link"
 * y "List-Link"). La usan la pestaña "Elementos" del editor y la página de
 * Documentación; no se usa en bloques reales.
 *
 * Hover y pressed no se pueden mostrar quietos: se ven al pasar el ratón y al
 * pulsar sobre cada muestra. El resto de estados (deshabilitado, fondo oscuro)
 * sí están aquí.
 */
import AtomButton from '../atoms/AtomButton.vue';
import AtomIcon from '../atoms/AtomIcon.vue';

const boxed = [
  { variant: 'primary', label: 'Primary' },
  { variant: 'secondary', label: 'Secondary' },
  { variant: 'terciary', label: 'Tertiary' },
] as const;

/* En el Figma, sobre fondo oscuro solo hay principal y secundario. */
const onDark = [
  { variant: 'primary', label: 'Primary' },
  { variant: 'secondary', label: 'Secondary' },
] as const;
</script>

<template>
  <div class="preview-stack">
    <!-- Variantes con caja: sin ícono, con ícono a cada lado y deshabilitadas. -->
    <div v-for="item in boxed" :key="item.variant" class="preview-group">
      <span class="preview-group__label">{{ item.label }}</span>
      <div class="preview-row-wrap">
        <AtomButton :variant="item.variant">Button</AtomButton>
        <AtomButton :variant="item.variant">
          Button
          <AtomIcon name="arrow-right" :size="16" />
        </AtomButton>
        <AtomButton :variant="item.variant">
          <AtomIcon name="check-circle" :size="16" />
          Button
        </AtomButton>
        <AtomButton :variant="item.variant" disabled>Button</AtomButton>
        <AtomButton :variant="item.variant" disabled>
          <AtomIcon name="check-circle" :size="16" />
          Button
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

    <!-- "Button Icon": la etiqueta con flecha y los cuadrados de solo ícono. -->
    <div class="preview-group">
      <span class="preview-group__label">Button Icon — texto con flecha</span>
      <div class="preview-row-wrap">
        <AtomButton variant="text">
          <AtomIcon name="arrow-right" :size="16" />
          label
        </AtomButton>
        <AtomButton variant="text">
          label
          <AtomIcon name="arrow-right" :size="16" />
        </AtomButton>
        <AtomButton variant="text" disabled>
          label
          <AtomIcon name="arrow-right" :size="16" />
        </AtomButton>
      </div>
    </div>

    <!--
      El "button-arrow": sobre el gris claro del marco del Figma, porque el
      blanco (light) está pensado para superficies claras y sobre blanco no se
      vería. La esquina superior izquierda va en ángulo recto.
    -->
    <div class="preview-group preview-group--light">
      <span class="preview-group__label">Button Icon — solo ícono (button-arrow)</span>
      <div class="preview-row-wrap">
        <AtomButton variant="primary" icon size="sm" aria-label="Siguiente">
          <AtomIcon name="chevron-right" :size="16" />
        </AtomButton>
        <AtomButton variant="primary" icon aria-label="Siguiente">
          <AtomIcon name="chevron-right" :size="16" />
        </AtomButton>
        <AtomButton variant="primary" icon size="lg" aria-label="Siguiente">
          <AtomIcon name="chevron-right" :size="24" />
        </AtomButton>
        <AtomButton variant="primary" icon disabled aria-label="Siguiente">
          <AtomIcon name="chevron-right" :size="16" />
        </AtomButton>
      </div>
      <div class="preview-row-wrap">
        <AtomButton variant="light" icon size="sm" aria-label="Siguiente">
          <AtomIcon name="chevron-right" :size="16" />
        </AtomButton>
        <AtomButton variant="light" icon aria-label="Siguiente">
          <AtomIcon name="chevron-right" :size="16" />
        </AtomButton>
        <AtomButton variant="light" icon size="lg" aria-label="Siguiente">
          <AtomIcon name="chevron-right" :size="24" />
        </AtomButton>
        <AtomButton variant="light" icon disabled aria-label="Siguiente">
          <AtomIcon name="chevron-right" :size="16" />
        </AtomButton>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Button Link</span>
      <div class="preview-row-wrap">
        <AtomButton variant="link">
          Ver historia
          <AtomIcon name="arrow-right" :size="16" />
        </AtomButton>
        <AtomButton variant="link" size="sm">
          Ver historia
          <AtomIcon name="arrow-right" :size="16" />
        </AtomButton>
        <AtomButton variant="link" disabled>
          Ver historia
          <AtomIcon name="arrow-right" :size="16" />
        </AtomButton>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">List-Link</span>
      <div class="preview-list">
        <AtomButton variant="list">
          <span>Placeholder</span>
          <AtomIcon name="arrow-right" :size="16" />
        </AtomButton>
        <AtomButton variant="list">
          <AtomIcon name="arrow-right" :size="16" />
          Placeholder
        </AtomButton>
        <AtomButton variant="list" disabled>
          <span>Placeholder</span>
          <AtomIcon name="arrow-right" :size="16" />
        </AtomButton>
      </div>
    </div>

    <!-- Sobre fondo oscuro: la prop `negative`. -->
    <div class="preview-group preview-group--dark">
      <span class="preview-group__label">Sobre fondo oscuro (negative)</span>
      <div v-for="item in onDark" :key="item.variant" class="preview-row-wrap">
        <AtomButton :variant="item.variant" negative>{{ item.label }}</AtomButton>
        <AtomButton :variant="item.variant" negative>
          {{ item.label }}
          <AtomIcon name="arrow-right" :size="16" />
        </AtomButton>
        <AtomButton :variant="item.variant" negative>
          <AtomIcon name="check-circle" :size="16" />
          {{ item.label }}
        </AtomButton>
      </div>
      <div class="preview-row-wrap">
        <AtomButton variant="text" negative>
          <AtomIcon name="arrow-right" :size="16" />
          label
        </AtomButton>
        <AtomButton variant="text" negative>
          label
          <AtomIcon name="arrow-right" :size="16" />
        </AtomButton>
        <AtomButton variant="link" negative>
          Ver historia
          <AtomIcon name="arrow-right" :size="16" />
        </AtomButton>
      </div>
      <div class="preview-list">
        <AtomButton variant="list" negative>
          <AtomIcon name="arrow-right" :size="16" />
          Placeholder
        </AtomButton>
        <AtomButton variant="list" negative>
          <span>Placeholder</span>
          <AtomIcon name="arrow-right" :size="16" />
        </AtomButton>
      </div>
    </div>

    <!-- Sobre un panel de color: surface (propia de la librería). -->
    <div class="preview-group preview-group--brand">
      <span class="preview-group__label">Sobre un panel de color (surface)</span>
      <div class="preview-row-wrap">
        <AtomButton variant="surface" icon size="sm" aria-label="Ir">
          <AtomIcon name="chevron-right" :size="16" />
        </AtomButton>
        <AtomButton variant="surface" icon aria-label="Ir">
          <AtomIcon name="chevron-right" :size="16" />
        </AtomButton>
        <AtomButton variant="primary" negative icon size="sm" aria-label="Ir">
          <AtomIcon name="chevron-right" :size="16" />
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
/* Mismo azul del fondo oscuro de la lámina del Figma. */
.preview-group--dark {
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: var(--ds-color-background-dark);
}
/* El gris claro del marco del button-arrow en el Figma. */
.preview-group--light {
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: var(--ds-color-background-light);
}
.preview-group--brand {
  padding: 16px;
  border-radius: 8px;
  background: var(--ds-color-surface-primary);
}
.preview-group__label {
  font-size: 10px;
  font-family: monospace;
  color: var(--ds-color-text-secondary);
  text-transform: uppercase;
}
.preview-group--dark .preview-group__label,
.preview-group--brand .preview-group__label {
  color: var(--ds-color-white-80);
}
.preview-row-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
/* La fila del List-Link ocupa todo el ancho: se acota para que se lea como lista. */
.preview-list {
  display: flex;
  flex-direction: column;
  max-width: 360px;
}
</style>
