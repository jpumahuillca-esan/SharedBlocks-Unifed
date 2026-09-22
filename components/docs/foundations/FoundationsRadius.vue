<script setup lang="ts">
/**
 * FoundationsRadius — radios de arcis-2 (Foundations > Radius), para la
 * página de Documentación. Sale de ds-tokens.css a través de dsTokens.ts.
 */
import { referenceOf, resolveToken, shortName, tokensByPrefix, type DsToken } from '../content/dsTokens';

const scale = tokensByPrefix('--ds-radius-');

const reference = (token: DsToken) => {
  const target = referenceOf(token);
  return target ? shortName(target) : '';
};
</script>

<template>
  <div class="fr__grid">
    <div v-for="r in scale" :key="r.name" class="fr__item">
      <span class="fr__box" :style="{ borderRadius: `var(${r.name})` }"></span>
      <span class="fr__token">{{ r.name }}</span>
      <span class="fr__value">{{ resolveToken(r.name) }}<template v-if="reference(r)"> · {{ reference(r) }}</template></span>
    </div>
  </div>
</template>

<style scoped>
/* El recuadro de vista previa es siempre claro (ver DocsSection.vue): el texto usa
   los tokens de arcis-2 y no los --docs-* del tema, que en oscuro serían claros. */
.fr__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.fr__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.fr__box {
  width: 72px;
  height: 72px;
  margin-bottom: 2px;
  background: var(--ds-color-action-primary);
}
.fr__token,
.fr__value {
  font-size: 11px;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.fr__token {
  color: var(--ds-color-text-primary);
}
.fr__value {
  font-size: 10px;
  color: var(--ds-color-text-secondary);
}
</style>
