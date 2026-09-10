<script setup lang="ts">
/**
 * FoundationsBreakpoints — tabla de breakpoints (ARCIS Design System,
 * Foundations > Breakpoints), para la página de Documentación.
 *
 * Son variables Sass ($breakpoints en assets/styles/breakpoints.scss),
 * no custom properties CSS — no se pueden leer en vivo desde un
 * componente Vue en tiempo de ejecución (el navegador nunca las ve,
 * se resuelven en tiempo de compilación). Esta tabla se mantiene a
 * mano en sincronía con ese archivo.
 */
const breakpoints = [
  { name: 'sm', value: '576px', note: 'Escala Bootstrap grid' },
  { name: 'md', value: '768px', note: 'Escala Bootstrap grid' },
  { name: 'lg', value: '992px', note: 'Escala Bootstrap grid' },
  { name: 'xl', value: '1200px', note: 'Escala Bootstrap grid' },
  { name: 'mobile', value: '768px', note: 'Hero y grids a 1 columna, menú off-canvas' },
  { name: 'cta', value: '520px', note: 'CTAs a ancho completo' },
];
</script>

<template>
  <table class="fbp__table">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Valor</th>
        <th>Uso</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="bp in breakpoints" :key="bp.name">
        <td class="fbp__name">{{ bp.name }}</td>
        <td class="fbp__value">{{ bp.value }}</td>
        <td>{{ bp.note }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
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
  color: var(--docs-text-subtle);
  border-bottom: 1px solid var(--docs-border);
}
.fbp__table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--docs-border);
  color: var(--docs-text);
}
.fbp__name,
.fbp__value {
  font-family: 'SFMono-Regular', Consolas, monospace;
}
</style>
