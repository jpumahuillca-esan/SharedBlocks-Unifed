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
import PreviewCodeSample from '../docs/PreviewCodeSample.vue';

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

type ButtonSample = 'plain' | 'arrow' | 'leading-icon' | 'disabled' | 'disabled-leading-icon';

const boxedMarker = (variant: string, sample: ButtonSample) => {
  const opening = `<AtomButton variant="${variant}"`;
  const examples: Record<ButtonSample, { marker: string; occurrence: number }> = {
    plain: { marker: `${opening}>Button</AtomButton>`, occurrence: 0 },
    arrow: { marker: `${opening}>`, occurrence: 1 },
    'leading-icon': { marker: `${opening}>`, occurrence: 2 },
    disabled: { marker: `${opening} disabled>Button</AtomButton>`, occurrence: 0 },
    'disabled-leading-icon': { marker: `${opening} disabled>`, occurrence: 1 },
  };

  return examples[sample];
};

const negativeMarker = (variant: string, sample: ButtonSample) => {
  const label = variant === 'primary' ? 'Primary' : 'Secondary';
  const opening = `<AtomButton variant="${variant}" negative`;
  const examples: Record<ButtonSample, { marker: string; occurrence: number }> = {
    plain: { marker: `${opening}>${label}</AtomButton>`, occurrence: 0 },
    arrow: { marker: `${opening}>`, occurrence: 1 },
    'leading-icon': { marker: `${opening}>`, occurrence: 2 },
    disabled: { marker: `${opening} disabled>${label}</AtomButton>`, occurrence: 0 },
    'disabled-leading-icon': { marker: `${opening} disabled>`, occurrence: 1 },
  };

  return examples[sample];
};
</script>

<template>
  <div class="preview-stack">
    <!-- Variantes con caja: sin ícono, con ícono a cada lado y deshabilitadas. -->
    <div v-for="item in boxed" :key="item.variant" class="preview-group">
      <span class="preview-group__label">{{ item.label }}</span>
      <div class="preview-row-wrap">
        <PreviewCodeSample v-bind="boxedMarker(item.variant, 'plain')" :label="`${item.label}, normal`">
          <AtomButton :variant="item.variant">Button</AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample v-bind="boxedMarker(item.variant, 'arrow')" :label="`${item.label}, con flecha`">
          <AtomButton :variant="item.variant">
            Button
            <AtomIcon name="arrow-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample v-bind="boxedMarker(item.variant, 'leading-icon')" :label="`${item.label}, con ícono`">
          <AtomButton :variant="item.variant">
            <AtomIcon name="check-circle" :size="16" />
            Button
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample v-bind="boxedMarker(item.variant, 'disabled')" :label="`${item.label}, deshabilitado`">
          <AtomButton :variant="item.variant" disabled>Button</AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample v-bind="boxedMarker(item.variant, 'disabled-leading-icon')" :label="`${item.label}, deshabilitado con ícono`">
          <AtomButton :variant="item.variant" disabled>
            <AtomIcon name="check-circle" :size="16" />
            Button
          </AtomButton>
        </PreviewCodeSample>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Tamaños</span>
      <div class="preview-row-wrap">
        <PreviewCodeSample marker='<AtomButton variant="primary" size="sm">Pequeño</AtomButton>' label="Tamaño pequeño">
          <AtomButton variant="primary" size="sm">Pequeño</AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomButton variant="primary" size="md">Mediano</AtomButton>' label="Tamaño mediano">
          <AtomButton variant="primary" size="md">Mediano</AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomButton variant="primary" size="lg">Grande</AtomButton>' label="Tamaño grande">
          <AtomButton variant="primary" size="lg">Grande</AtomButton>
        </PreviewCodeSample>
      </div>
    </div>

    <!-- "Button Icon": la etiqueta con flecha y los cuadrados de solo ícono. -->
    <div class="preview-group">
      <span class="preview-group__label">Button Icon — texto con flecha</span>
      <div class="preview-row-wrap">
        <PreviewCodeSample marker='<AtomButton variant="text">' :occurrence="0" label="Texto con flecha a la izquierda">
          <AtomButton variant="text">
            <AtomIcon name="arrow-right" :size="16" />
            label
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomButton variant="text">' :occurrence="1" label="Texto con flecha a la derecha">
          <AtomButton variant="text">
            label
            <AtomIcon name="arrow-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomButton variant="text" disabled>' label="Texto deshabilitado">
          <AtomButton variant="text" disabled>
            label
            <AtomIcon name="arrow-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
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
        <PreviewCodeSample marker='<AtomButton variant="primary" icon size="sm" aria-label="Siguiente">' label="Botón con ícono, pequeño">
          <AtomButton variant="primary" icon size="sm" aria-label="Siguiente">
            <AtomIcon name="chevron-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomButton variant="primary" icon aria-label="Siguiente">' label="Botón con ícono, mediano">
          <AtomButton variant="primary" icon aria-label="Siguiente">
            <AtomIcon name="chevron-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomButton variant="primary" icon size="lg" aria-label="Siguiente">' label="Botón con ícono, grande">
          <AtomButton variant="primary" icon size="lg" aria-label="Siguiente">
            <AtomIcon name="chevron-right" :size="24" />
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomButton variant="primary" icon disabled aria-label="Siguiente">' label="Botón con ícono deshabilitado">
          <AtomButton variant="primary" icon disabled aria-label="Siguiente">
            <AtomIcon name="chevron-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
      </div>
      <div class="preview-row-wrap">
        <PreviewCodeSample marker='<AtomButton variant="light" icon size="sm" aria-label="Siguiente">' label="Botón claro con ícono, pequeño">
          <AtomButton variant="light" icon size="sm" aria-label="Siguiente">
            <AtomIcon name="chevron-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomButton variant="light" icon aria-label="Siguiente">' label="Botón claro con ícono, mediano">
          <AtomButton variant="light" icon aria-label="Siguiente">
            <AtomIcon name="chevron-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomButton variant="light" icon size="lg" aria-label="Siguiente">' label="Botón claro con ícono, grande">
          <AtomButton variant="light" icon size="lg" aria-label="Siguiente">
            <AtomIcon name="chevron-right" :size="24" />
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomButton variant="light" icon disabled aria-label="Siguiente">' label="Botón claro con ícono deshabilitado">
          <AtomButton variant="light" icon disabled aria-label="Siguiente">
            <AtomIcon name="chevron-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">Button Link</span>
      <div class="preview-row-wrap">
        <PreviewCodeSample marker='<AtomButton variant="link" href="/historias">' label="Button Link">
          <AtomButton variant="link">
            Ver historia
            <AtomIcon name="arrow-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomButton variant="link" size="sm" href="/historias">' label="Button Link, pequeño">
          <AtomButton variant="link" size="sm">
            Ver historia
            <AtomIcon name="arrow-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomButton variant="link" disabled>' label="Button Link deshabilitado">
          <AtomButton variant="link" disabled>
            Ver historia
            <AtomIcon name="arrow-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
      </div>
    </div>

    <div class="preview-group">
      <span class="preview-group__label">List-Link</span>
      <div class="preview-list">
        <PreviewCodeSample block marker='<AtomButton variant="list" href="/carreras">' :occurrence="0" label="List-Link con texto primero">
          <AtomButton variant="list">
            <span>Placeholder</span>
            <AtomIcon name="arrow-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample block marker='<AtomButton variant="list" href="/carreras">' :occurrence="1" label="List-Link con ícono primero">
          <AtomButton variant="list">
            <AtomIcon name="arrow-right" :size="16" />
            Placeholder
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample block marker='<AtomButton variant="list" disabled>' label="List-Link deshabilitado">
          <AtomButton variant="list" disabled>
            <span>Placeholder</span>
            <AtomIcon name="arrow-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
      </div>
    </div>

    <!-- Sobre fondo oscuro: la prop `negative`. -->
    <div class="preview-group preview-group--dark">
      <span class="preview-group__label">Sobre fondo oscuro (negative)</span>
      <div v-for="item in onDark" :key="item.variant" class="preview-row-wrap">
        <PreviewCodeSample v-bind="negativeMarker(item.variant, 'plain')" :label="`${item.label} negativo`">
          <AtomButton :variant="item.variant" negative>{{ item.label }}</AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample v-bind="negativeMarker(item.variant, 'arrow')" :label="`${item.label} negativo con flecha`">
          <AtomButton :variant="item.variant" negative>
            {{ item.label }}
            <AtomIcon name="arrow-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample v-bind="negativeMarker(item.variant, 'leading-icon')" :label="`${item.label} negativo con ícono`">
          <AtomButton :variant="item.variant" negative>
            <AtomIcon name="check-circle" :size="16" />
            {{ item.label }}
          </AtomButton>
        </PreviewCodeSample>
      </div>
      <div class="preview-row-wrap">
        <PreviewCodeSample marker='<AtomButton variant="text" negative>' :occurrence="0" label="Texto negativo con flecha a la izquierda">
          <AtomButton variant="text" negative>
            <AtomIcon name="arrow-right" :size="16" />
            label
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomButton variant="text" negative>' :occurrence="1" label="Texto negativo con flecha a la derecha">
          <AtomButton variant="text" negative>
            label
            <AtomIcon name="arrow-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomButton variant="link" negative>' label="Button Link negativo">
          <AtomButton variant="link" negative>
            Ver historia
            <AtomIcon name="arrow-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
      </div>
      <div class="preview-list">
        <PreviewCodeSample block marker='<AtomButton variant="list" negative>' :occurrence="0" label="List-Link negativo con ícono primero">
          <AtomButton variant="list" negative>
            <AtomIcon name="arrow-right" :size="16" />
            Placeholder
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample block marker='<AtomButton variant="list" negative>' :occurrence="1" label="List-Link negativo con texto primero">
          <AtomButton variant="list" negative>
            <span>Placeholder</span>
            <AtomIcon name="arrow-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
      </div>
    </div>

    <!-- Sobre un panel de color: surface (propia de la librería). -->
    <div class="preview-group preview-group--brand">
      <span class="preview-group__label">Sobre un panel de color (surface)</span>
      <div class="preview-row-wrap">
        <PreviewCodeSample marker='<AtomButton variant="surface" icon size="sm" aria-label="Ir">' label="Surface, pequeño">
          <AtomButton variant="surface" icon size="sm" aria-label="Ir">
            <AtomIcon name="chevron-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomButton variant="surface" icon aria-label="Ir">' label="Surface, mediano">
          <AtomButton variant="surface" icon aria-label="Ir">
            <AtomIcon name="chevron-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
        <PreviewCodeSample marker='<AtomButton variant="primary" negative icon size="sm" aria-label="Ir">' label="Primary negativo con ícono sobre color">
          <AtomButton variant="primary" negative icon size="sm" aria-label="Ir">
            <AtomIcon name="chevron-right" :size="16" />
          </AtomButton>
        </PreviewCodeSample>
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
