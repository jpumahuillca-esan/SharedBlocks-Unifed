<script setup lang="ts">
/**
 * FoundationsBreakpoints — puntos de quiebre (Foundations > Breakpoints), para
 * la página de Documentación.
 *
 * Los breakpoints son variables Sass (el mapa $breakpoints de
 * breakpoints.scss): el navegador nunca las ve, así que no se pueden leer en
 * vivo. Se leen del propio archivo como texto, a través de dsTokens.ts, y se
 * cruzan con los --ds-breakpoint-* del export de Figma: si alguna vez dejan de
 * coincidir, la tabla lo marca.
 *
 * Lo único escrito a mano es la columna "Uso", que es explicación y no valor.
 */
import { DS_BREAKPOINTS } from '../content/dsTokens';

const USES: Record<string, string> = {
  xs: 'Base: desde 0, sin mínimo.',
  sm: 'Teléfono. Por debajo, hero, ecosistema, mapamundi, tarjetas de valor y grilla de imágenes pasan a su composición de teléfono.',
  md: 'Tableta. Por debajo, la tipografía y el espaciado semánticos pasan a su versión móvil, y las secciones de tarjetas, los CTA y el footer cambian de composición.',
  lg: 'Escritorio. Por debajo, el navbar pasa al menú lateral, el topbar baja bajo la barra y el footer pasa a acordeón.',
  xl: 'Ancho máximo del contenido (--ds-container-max).',
  '2xl': 'Pantallas grandes.',
  '3xl': 'Pantallas muy grandes.',
  cta: 'Propio de la librería, sin equivalente en arcis-2: los botones de CTA pasan a ancho completo.',
};

/* Los mixins -down cortan justo antes del valor: "debajo de md" es < 768px. */
const downLimit = (value: string) => {
  const n = parseFloat(value);
  return n > 0 ? `< ${n}px` : '—';
};
</script>

<template>
  <div>
    <table class="fbp__table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Valor</th>
          <th>Figma</th>
          <th>-down aplica</th>
          <th>Uso</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="bp in DS_BREAKPOINTS" :key="bp.name">
          <td class="fbp__mono">{{ bp.name }}</td>
          <td class="fbp__mono">{{ bp.value }}</td>
          <td class="fbp__mono">
            <span v-if="!bp.figma" class="fbp__muted">no está en Figma</span>
            <span v-else-if="parseFloat(bp.figma) === parseFloat(bp.value)" class="fbp__muted" :title="`--ds-breakpoint-${bp.name}`">coincide</span>
            <span v-else class="fbp__warn">Figma dice {{ bp.figma }}</span>
          </td>
          <td class="fbp__mono">{{ downLimit(bp.value) }}</td>
          <td>{{ USES[bp.name] ?? '' }}</td>
        </tr>
      </tbody>
    </table>

    <p class="fbp__hint">
      En los estilos: <code>@use '../breakpoints' as bp;</code> y
      <code>@include bp.container-down('md') {…}</code>. <code>container-down</code> responde al ancho del
      bloque además del de la ventana, así funciona igual en el lienzo del editor y en una columna estrecha.
    </p>
  </div>
</template>

<style scoped>
/* El recuadro de vista previa es siempre claro (ver DocsSection.vue): el texto usa
   los tokens de arcis-2 y no los --docs-* del tema, que en oscuro serían claros. */
.fbp__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.fbp__table th {
  text-align: left;
  padding: 8px 12px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--ds-color-text-secondary);
  border-bottom: 1px solid var(--ds-color-border-subtle);
  white-space: nowrap;
}
.fbp__table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--ds-color-border-subtle);
  color: var(--ds-color-text-primary);
}
.fbp__mono {
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.fbp__muted {
  font-size: 11px;
  color: var(--ds-color-text-secondary);
}
.fbp__warn {
  font-size: 11px;
  color: var(--ds-color-feedback-error-dark);
}
.fbp__hint {
  margin: 14px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--ds-color-text-secondary);
}
</style>
