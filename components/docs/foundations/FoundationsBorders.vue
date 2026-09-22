<script setup lang="ts">
/**
 * FoundationsBorders — anchos y colores de borde de arcis-2 (Foundations >
 * Borders), para la página de Documentación.
 *
 * Los anchos son --ds-border-width-*; los colores, el grupo semántico
 * "Color / Border" del export. Todo sale de ds-tokens.css a través de
 * dsTokens.ts.
 */
import { groupsWhere, referenceOf, resolveToken, shortName, tokensByPrefix, type DsToken } from '../content/dsTokens';

const widths = tokensByPrefix('--ds-border-width-');
const colors = groupsWhere('semantic', 'Color / Border').flatMap((group) => group.tokens);

/* Los bordes "inverse" son para fondos oscuros: sobre blanco no se verían. */
const onDark = (token: DsToken) => token.name.includes('inverse');

const reference = (token: DsToken) => {
  const target = referenceOf(token);
  return target ? shortName(target, target.startsWith('--ds-color-') ? '--ds-color-' : '--ds-') : '';
};
</script>

<template>
  <div class="fb">
    <div class="fb__group">
      <h4 class="fb__group-title">Anchos</h4>
      <div class="fb__grid">
        <div v-for="w in widths" :key="w.name" class="fb__item">
          <span
            class="fb__box"
            :style="{ borderWidth: `var(${w.name})`, borderColor: 'var(--ds-color-action-primary)', borderStyle: 'solid' }"
          ></span>
          <span class="fb__token" :title="w.name">{{ shortName(w.name) }}</span>
          <span class="fb__value">{{ resolveToken(w.name) }}</span>
        </div>
      </div>
    </div>

    <div class="fb__group">
      <h4 class="fb__group-title">Colores (semánticos)</h4>
      <div class="fb__grid">
        <div v-for="c in colors" :key="c.name" class="fb__item">
          <span
            class="fb__box"
            :class="{ 'is-dark': onDark(c) }"
            :style="{ borderWidth: '2px', borderColor: `var(${c.name})`, borderStyle: 'solid' }"
          ></span>
          <span class="fb__token" :title="c.name">{{ shortName(c.name, '--ds-color-') }}</span>
          <span class="fb__value" :title="`${resolveToken(c.name)} · ${reference(c)}`">{{ resolveToken(c.name) }}<template v-if="reference(c)"> · {{ reference(c) }}</template></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* El recuadro de vista previa es siempre claro (ver DocsSection.vue): el texto usa
   los tokens de arcis-2 y no los --docs-* del tema, que en oscuro serían claros. */
.fb__group {
  margin-bottom: 24px;
}
.fb__group:last-child {
  margin-bottom: 0;
}
.fb__group-title {
  margin: 0 0 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ds-color-text-secondary);
}
.fb__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.fb__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 140px;
}
.fb__box {
  /* Blanco fijo a propósito: los grises de borde perderían contraste sobre el
     fondo de la documentación, que cambia con su tema claro/oscuro. */
  width: 72px;
  height: 72px;
  margin-bottom: 2px;
  border-radius: 8px;
  background: var(--ds-color-white);
}
.fb__box.is-dark {
  background: var(--ds-color-background-inverse);
}
.fb__token,
.fb__value {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.fb__token {
  font-size: 11px;
  color: var(--ds-color-text-primary);
}
.fb__value {
  font-size: 10px;
  color: var(--ds-color-text-secondary);
}
</style>
