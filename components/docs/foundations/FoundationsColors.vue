<script setup lang="ts">
/**
 * FoundationsColors — la paleta de arcis-2 (Foundations > Colors), para la
 * página de Documentación.
 *
 * Sale entera de ds-tokens.css a través de dsTokens.ts: los grupos son los
 * del export de Figma, en su mismo orden, y el valor de cada muestra se
 * resuelve siguiendo su cadena de var(). No hay nada que sincronizar a mano.
 *
 * Primero los semánticos, que son los que usan los componentes; después los
 * primitivos, que solo completan donde no hay semántico (ver tokens.scss).
 */
import {
  groupsWhere,
  referenceOf,
  resolveToken,
  shortName,
  type DsGroup,
  type DsToken,
} from '../content/dsTokens';

const layers = [
  {
    title: 'Semánticos',
    hint: 'Lo que usan los componentes: color con propósito (fondo, texto, acción, borde, marca, feedback).',
    groups: groupsWhere('semantic', 'Color /'),
  },
  {
    title: 'Primitivos',
    hint: 'La escala cruda. Solo para completar donde no hay un semántico que corresponda.',
    groups: [...groupsWhere('foundation', 'Color /'), ...groupsWhere('foundation', 'Alpha /')],
  },
];

const groupTitle = (group: DsGroup) => group.title.replace(/^Color\s*\/\s*/, '');
const label = (token: DsToken) => shortName(token.name, '--ds-color-');
const reference = (token: DsToken) => {
  const target = referenceOf(token);
  return target ? shortName(target, '--ds-color-') : '';
};
const value = (token: DsToken) => resolveToken(token.name);

/* Un color con transparencia se pinta sobre cuadros: sobre blanco no se vería. */
const isTranslucent = (token: DsToken) => /\/\s*(0|0?\.\d+)\s*\)/.test(value(token));
</script>

<template>
  <div class="fc">
    <section v-for="layer in layers" :key="layer.title" class="fc__layer">
      <h3 class="fc__layer-title">{{ layer.title }}</h3>
      <p class="fc__layer-hint">{{ layer.hint }}</p>

      <div v-for="group in layer.groups" :key="group.title" class="fc__group">
        <h4 class="fc__group-title">{{ groupTitle(group) }}</h4>
        <div class="fc__grid">
          <div v-for="token in group.tokens" :key="token.name" class="fc__swatch">
            <span class="fc__chip" :class="{ 'is-translucent': isTranslucent(token) }">
              <span class="fc__chip-color" :style="{ backgroundColor: `var(${token.name})` }"></span>
            </span>
            <span class="fc__label" :title="token.name">{{ label(token) }}</span>
            <span v-if="reference(token)" class="fc__ref">→ {{ reference(token) }}</span>
            <span class="fc__hex">{{ value(token) }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* El recuadro de vista previa es siempre claro (ver DocsSection.vue): el texto usa
   los tokens de arcis-2 y no los --docs-* del tema, que en oscuro serían claros. */
.fc__layer + .fc__layer {
  margin-top: 40px;
}
.fc__layer-title {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 700;
  color: var(--ds-color-text-primary);
}
.fc__layer-hint {
  margin: 0 0 20px;
  font-size: 12px;
  color: var(--ds-color-text-secondary);
}
.fc__group {
  margin-bottom: 28px;
}
.fc__group:last-child {
  margin-bottom: 0;
}
.fc__group-title {
  margin: 0 0 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ds-color-text-secondary);
}
.fc__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}
.fc__swatch {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}
.fc__chip {
  display: block;
  height: 48px;
  margin-bottom: 2px;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}
/* Cuadros detrás de los colores con transparencia. */
.fc__chip.is-translucent {
  background-color: #fff;
  background-image:
    linear-gradient(45deg, #d9dde3 25%, transparent 25%),
    linear-gradient(-45deg, #d9dde3 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #d9dde3 75%),
    linear-gradient(-45deg, transparent 75%, #d9dde3 75%);
  background-size: 12px 12px;
  background-position: 0 0, 0 6px, 6px -6px, -6px 0;
}
.fc__chip-color {
  display: block;
  width: 100%;
  height: 100%;
}
.fc__label,
.fc__ref,
.fc__hex {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.fc__label {
  font-size: 11px;
  color: var(--ds-color-text-primary);
}
.fc__ref,
.fc__hex {
  font-size: 10px;
  color: var(--ds-color-text-secondary);
}
.fc__hex {
  text-transform: uppercase;
}
</style>
