<script setup lang="ts">
/**
 * FoundationsSpacing — espaciado de arcis-2 (Foundations > Spacing), para la
 * página de Documentación.
 *
 * Dos escalas, leídas de ds-tokens.css a través de dsTokens.ts:
 *   semántica  --ds-spacing-*  responsive: cambia por debajo de md
 *   primitiva  --ds-space-*    fija
 *
 * Las barras de la semántica usan el valor ya resuelto de cada modo (y no el
 * var()), para poder enseñar escritorio y móvil a la vez.
 */
import { MOBILE_QUERY, referenceOf, resolveToken, shortName, tokensByPrefix, type DsToken } from '../content/dsTokens';

const semantic = tokensByPrefix('--ds-spacing-');
const primitives = tokensByPrefix('--ds-space-');

const desktop = (token: DsToken) => resolveToken(token.name, 'desktop');
const mobile = (token: DsToken) => resolveToken(token.name, 'mobile');
const reference = (token: DsToken, mode: 'desktop' | 'mobile') => {
  const target = referenceOf(token, mode);
  return target ? shortName(target) : '';
};
</script>

<template>
  <div class="fs">
    <div class="fs__group">
      <h4 class="fs__group-title">Semántico (responsive)</h4>
      <p class="fs__hint">
        Para <strong>padding, margin y gap</strong>. Móvil = <code>{{ MOBILE_QUERY }}</code>.
        Para medidas y posiciones (width, height, top…) usa los primitivos: estos se encogen en móvil.
      </p>
      <div class="fs__scale">
        <div v-for="s in semantic" :key="s.name" class="fs__row fs__row--pair">
          <span class="fs__token">{{ s.name }}</span>
          <div class="fs__bars">
            <div class="fs__bar-line">
              <span class="fs__bar" :style="{ width: desktop(s) }"></span>
              <span class="fs__value">{{ desktop(s) }} <em>escritorio · {{ reference(s, 'desktop') }}</em></span>
            </div>
            <div class="fs__bar-line">
              <span class="fs__bar fs__bar--mobile" :style="{ width: mobile(s) }"></span>
              <span class="fs__value">{{ mobile(s) }} <em>móvil · {{ reference(s, 'mobile') }}</em></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="fs__group">
      <h4 class="fs__group-title">Primitivo</h4>
      <div class="fs__scale">
        <div v-for="s in primitives" :key="s.name" class="fs__row">
          <span class="fs__token">{{ s.name }}</span>
          <span class="fs__bar" :style="{ width: `var(${s.name})` }"></span>
          <span class="fs__value">{{ desktop(s) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* El recuadro de vista previa es siempre claro (ver DocsSection.vue): el texto usa
   los tokens de arcis-2 y no los --docs-* del tema, que en oscuro serían claros. */
.fs__group {
  margin-bottom: 28px;
}
.fs__group:last-child {
  margin-bottom: 0;
}
.fs__group-title {
  margin: 0 0 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ds-color-text-secondary);
}
.fs__hint {
  margin: -4px 0 14px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--ds-color-text-secondary);
}
.fs__scale {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.fs__row {
  display: flex;
  align-items: center;
  gap: 16px;
}
.fs__row--pair {
  align-items: flex-start;
}
.fs__token {
  flex-shrink: 0;
  width: 130px;
  font-size: 11px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  color: var(--ds-color-text-secondary);
}
.fs__bars {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.fs__bar-line {
  display: flex;
  align-items: center;
  gap: 12px;
}
.fs__bar {
  flex-shrink: 0;
  height: 14px;
  border-radius: 3px;
  background: var(--ds-color-action-primary);
}
/* Móvil en un tono más suave, para distinguirlo de un vistazo. */
.fs__bar--mobile {
  background: var(--ds-color-red-300);
}
.fs__value {
  font-size: 11px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  color: var(--ds-color-text-primary);
  white-space: nowrap;
}
.fs__value em {
  font-style: normal;
  color: var(--ds-color-text-secondary);
}
</style>
