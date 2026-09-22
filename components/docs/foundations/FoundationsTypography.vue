<script setup lang="ts">
/**
 * FoundationsTypography — familias, escala, pesos, interlineado y espaciado
 * entre letras de arcis-2 (Foundations > Typography), para la página de
 * Documentación.
 *
 * Sale de ds-tokens.css y _extensions.scss a través de dsTokens.ts. La escala
 * es responsive: se muestran los dos valores, escritorio y móvil, leídos del
 * archivo y no de la ventana, así que se ven igual sea cual sea su ancho.
 */
import {
  MOBILE_QUERY,
  referenceOf,
  resolveToken,
  shortName,
  tokensByPrefix,
  type DsToken,
} from '../content/dsTokens';

const px = (token: DsToken) => parseFloat(resolveToken(token.name)) || 0;

const families = tokensByPrefix('--ds-font-family-').map((token) => ({
  token,
  /* La primera familia de la pila es la del diseño; el resto son respaldo. */
  sample: token.value.match(/"([^"]+)"/)?.[1] ?? shortName(token.name),
}));

/* De mayor a menor, como se lee una escala: el orden del archivo no lo es. */
const scale = tokensByPrefix('--ds-text-').sort((a, b) => px(b) - px(a));

const weights = tokensByPrefix('--ds-weight-');
const lineHeights = tokensByPrefix('--ds-line-height-');
const letterSpacings = tokensByPrefix('--ds-letter-spacing-');

const desktop = (token: DsToken) => resolveToken(token.name, 'desktop');
const mobile = (token: DsToken) => resolveToken(token.name, 'mobile');
const reference = (token: DsToken) => {
  const target = referenceOf(token);
  return target ? shortName(target) : '';
};
</script>

<template>
  <div class="ft">
    <div class="ft__group">
      <h4 class="ft__group-title">Familias</h4>
      <div class="ft__families">
        <div v-for="f in families" :key="f.token.name" class="ft__family-row">
          <span class="ft__family-sample" :style="{ fontFamily: `var(${f.token.name})` }">{{ f.sample }}</span>
          <span class="ft__token">{{ f.token.name }}</span>
        </div>
      </div>
    </div>

    <div class="ft__group">
      <h4 class="ft__group-title">Escala (semántica, responsive)</h4>
      <p class="ft__hint">
        Móvil = <code>{{ MOBILE_QUERY }}</code>. La muestra usa el valor del ancho actual de la ventana.
      </p>
      <table class="ft__table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Escritorio</th>
            <th>Móvil</th>
            <th>Muestra</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in scale" :key="s.name">
            <td class="ft__mono">
              {{ s.name }}
              <span v-if="s.layer === 'extension'" class="ft__tag" title="Definido en ds/_extensions.scss: arcis-2 no lo trae">local</span>
              <span v-else-if="reference(s)" class="ft__ref">→ {{ reference(s) }}</span>
            </td>
            <td class="ft__mono">{{ desktop(s) }}</td>
            <td class="ft__mono" :class="{ 'is-same': mobile(s) === desktop(s) }">{{ mobile(s) }}</td>
            <td>
              <span class="ft__scale-sample" :style="{ fontSize: `var(${s.name})` }">Aa Ee Ii</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="ft__group">
      <h4 class="ft__group-title">Pesos</h4>
      <div class="ft__scale">
        <div v-for="w in weights" :key="w.name" class="ft__scale-row">
          <span class="ft__token ft__token--fixed">{{ w.name }} ({{ desktop(w) }})</span>
          <span class="ft__scale-sample" :style="{ fontWeight: `var(${w.name})`, fontSize: '18px' }">
            Postulaciones abiertas
          </span>
        </div>
      </div>
    </div>

    <div class="ft__group ft__group--pair">
      <div>
        <h4 class="ft__group-title">Interlineado</h4>
        <div v-for="l in lineHeights" :key="l.name" class="ft__kv">
          <span class="ft__token">{{ l.name }}</span>
          <span class="ft__mono">{{ desktop(l) }}</span>
        </div>
      </div>
      <div>
        <h4 class="ft__group-title">Espaciado entre letras</h4>
        <div v-for="l in letterSpacings" :key="l.name" class="ft__kv">
          <span class="ft__token">{{ l.name }}</span>
          <span class="ft__mono">{{ desktop(l) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* El recuadro de vista previa es siempre claro (ver DocsSection.vue): el texto usa
   los tokens de arcis-2 y no los --docs-* del tema, que en oscuro serían claros. */
.ft__group {
  margin-bottom: 28px;
}
.ft__group:last-child {
  margin-bottom: 0;
}
.ft__group--pair {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}
.ft__group-title {
  margin: 0 0 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ds-color-text-secondary);
}
.ft__hint {
  margin: -4px 0 12px;
  font-size: 12px;
  color: var(--ds-color-text-secondary);
}
.ft__families {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ft__family-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
}
.ft__family-sample {
  font-size: 22px;
  color: var(--ds-color-text-primary);
}
.ft__token,
.ft__mono {
  font-size: 11px;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ft__token {
  color: var(--ds-color-text-secondary);
}
.ft__mono {
  color: var(--ds-color-text-primary);
}
.ft__mono.is-same {
  color: var(--ds-color-text-secondary);
}
.ft__token--fixed {
  flex-shrink: 0;
  width: 200px;
}
.ft__ref {
  margin-left: 6px;
  color: var(--ds-color-text-secondary);
}
.ft__tag {
  margin-left: 6px;
  padding: 1px 6px;
  border: 1px solid var(--ds-color-border-subtle);
  border-radius: 999px;
  font-size: 10px;
  color: var(--ds-color-text-secondary);
}
.ft__table {
  width: 100%;
  border-collapse: collapse;
}
.ft__table th {
  text-align: left;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--ds-color-text-secondary);
  border-bottom: 1px solid var(--ds-color-border-subtle);
}
.ft__table td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--ds-color-border-subtle);
  vertical-align: middle;
}
.ft__scale {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ft__scale-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
}
.ft__scale-sample {
  color: var(--ds-color-text-primary);
  line-height: 1.2;
  white-space: nowrap;
}
.ft__kv {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 0;
  border-bottom: 1px solid var(--ds-color-border-subtle);
}
</style>
