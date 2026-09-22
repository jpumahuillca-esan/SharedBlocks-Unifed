<script setup lang="ts">
/**
 * FoundationsShadows — sombras (Foundations > Shadows), para la página de
 * Documentación.
 *
 * arcis-2 todavía no define sombras: estas son extensiones locales de
 * ds/_extensions.scss, con el valor de los tokens anteriores. Se leen a través
 * de dsTokens.ts; si Figma las incorpora, esta página muestra las suyas.
 */
import { resolveToken, tokensByPrefix } from '../content/dsTokens';

const scale = tokensByPrefix('--ds-shadow-');
</script>

<template>
  <div class="fsh__grid">
    <div v-for="s in scale" :key="s.name" class="fsh__item">
      <span class="fsh__box" :style="{ boxShadow: `var(${s.name})` }"></span>
      <span class="fsh__token">
        {{ s.name }}
        <span v-if="s.layer === 'extension'" class="fsh__tag" title="Definido en ds/_extensions.scss: arcis-2 no lo trae">local</span>
      </span>
      <span class="fsh__value">{{ resolveToken(s.name) }}</span>
    </div>
  </div>
</template>

<style scoped>
/* El recuadro de vista previa es siempre claro (ver DocsSection.vue): el texto usa
   los tokens de arcis-2 y no los --docs-* del tema, que en oscuro serían claros. */
.fsh__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}
.fsh__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-width: 200px;
}
.fsh__box {
  /* Blanco fijo a propósito: las sombras se calibraron para una superficie
     clara y sobre el fondo oscuro de la documentación perderían contraste. */
  width: 96px;
  height: 72px;
  margin-bottom: 4px;
  border-radius: 8px;
  background: var(--ds-color-white);
}
.fsh__token,
.fsh__value {
  font-family: 'SFMono-Regular', Consolas, monospace;
  text-align: center;
}
.fsh__token {
  font-size: 11px;
  color: var(--ds-color-text-primary);
}
.fsh__value {
  font-size: 10px;
  color: var(--ds-color-text-secondary);
}
.fsh__tag {
  margin-left: 4px;
  padding: 1px 6px;
  border: 1px solid var(--ds-color-border-subtle);
  border-radius: 999px;
  font-size: 10px;
  color: var(--ds-color-text-secondary);
}
</style>
