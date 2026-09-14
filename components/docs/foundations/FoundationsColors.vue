<script setup lang="ts">
/**
 * FoundationsColors — paleta completa de colores (ARCIS Design System,
 * Foundations > Colors), para la página de Documentación.
 *
 * La lista de variables se mantiene a mano, agrupada exactamente igual
 * que los comentarios de sección en assets/styles/tokens.scss (fuente
 * de verdad) — hay que sincronizarla ahí si se agregan/quitan tokens.
 * El valor hex mostrado junto a cada swatch SÍ se lee en vivo vía
 * getComputedStyle, así que ese número nunca queda desactualizado
 * aunque cambie el valor del token.
 */
import { ref, onMounted } from 'vue';

interface ColorToken {
  label: string;
  cssVar: string;
}
interface ColorGroup {
  title: string;
  tokens: ColorToken[];
}

const groups: ColorGroup[] = [
  {
    title: 'Global',
    tokens: [
      { label: 'global-main', cssVar: '--arcis-color-global-main' },
      { label: 'global-dark', cssVar: '--arcis-color-global-dark' },
    ],
  },
  {
    title: 'Texto',
    tokens: [
      { label: 'text-primary', cssVar: '--arcis-color-text-primary' },
      { label: 'text-secondary', cssVar: '--arcis-color-text-secondary' },
      { label: 'text-disabled', cssVar: '--arcis-color-text-disabled' },
      { label: 'text-inverse', cssVar: '--arcis-color-text-inverse' },
    ],
  },
  {
    title: 'Neutrals (corporativos)',
    tokens: [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((n) => ({
      label: `neutrals-${n}`,
      cssVar: `--neutrals-${n}`,
    })),
  },
  {
    title: 'Corporate primary / secondary',
    tokens: [
      { label: 'corp-primary-main', cssVar: '--corp-primary-main' },
      { label: 'corp-primary-dark', cssVar: '--corp-primary-dark' },
      { label: 'corp-secondary-main', cssVar: '--corp-secondary-main' },
      { label: 'corp-secondary-dark', cssVar: '--corp-secondary-dark' },
      { label: 'corporate-secondary-black', cssVar: '--arcis-color-corporate-secondary-black' },
    ],
  },
  {
    title: 'University primary / secondary',
    tokens: [
      { label: 'univ-primary', cssVar: '--arcis-color-univ-primary' },
      { label: 'univ-sky-100', cssVar: '--arcis-color-univ-sky-100' },
      { label: 'univ-sky-500', cssVar: '--arcis-color-univ-sky-500' },
      { label: 'univ-beige-100', cssVar: '--arcis-color-univ-beige-100' },
      { label: 'univ-beige-500', cssVar: '--arcis-color-univ-beige-500' },
    ],
  },
  {
    title: 'University faculties',
    tokens: [
      { label: 'univ-blue-100', cssVar: '--univ-blue-100' },
      { label: 'univ-blue-500', cssVar: '--univ-blue-500' },
      { label: 'univ-wine-100', cssVar: '--univ-wine-100' },
      { label: 'univ-wine-500', cssVar: '--univ-wine-500' },
      { label: 'univ-cyan-100', cssVar: '--univ-cyan-100' },
      { label: 'univ-cyan-500', cssVar: '--univ-cyan-500' },
      { label: 'univ-green-100', cssVar: '--univ-green-100' },
      { label: 'univ-green-500', cssVar: '--univ-green-500' },
      { label: 'univ-yellow-100', cssVar: '--univ-yellow-100' },
      { label: 'univ-yellow-500', cssVar: '--univ-yellow-500' },
      { label: 'univ-orange-100', cssVar: '--univ-orange-100' },
      { label: 'univ-orange-500', cssVar: '--univ-orange-500' },
    ],
  },
  {
    title: 'University maestrías',
    tokens: [
      { label: 'maestrias-main', cssVar: '--arcis-color-univ-maestrias-main' },
      { label: 'maestrias-dark', cssVar: '--arcis-color-univ-maestrias-dark' },
      { label: 'maestrias-grey-100', cssVar: '--arcis-color-univ-maestrias-grey-100' },
      { label: 'maestrias-grey-500', cssVar: '--arcis-color-univ-maestrias-grey-500' },
      { label: 'maestrias-grayish-100', cssVar: '--arcis-color-univ-maestrias-grayish-100' },
      { label: 'maestrias-grayish-500', cssVar: '--arcis-color-univ-maestrias-grayish-500' },
    ],
  },
  {
    title: 'DPA',
    tokens: [
      { label: 'dpa-primary-main', cssVar: '--arcis-color-dpa-primary-main' },
      { label: 'dpa-secondary-main', cssVar: '--arcis-color-dpa-secondary-main' },
    ],
  },
  {
    title: 'Graduate primary / secondary',
    tokens: [
      { label: 'graduate-primary-main', cssVar: '--arcis-color-graduate-primary-main' },
      { label: 'graduate-ee-100', cssVar: '--graduate-ee-100' },
      { label: 'graduate-ee-500', cssVar: '--graduate-ee-500' },
      { label: 'graduate-me-100', cssVar: '--graduate-me-100' },
      { label: 'graduate-me-500', cssVar: '--graduate-me-500' },
      { label: 'graduate-mba-100', cssVar: '--graduate-mba-100' },
      { label: 'graduate-mba-500', cssVar: '--graduate-mba-500' },
      { label: 'graduate-mba-gold', cssVar: '--graduate-mba-gold' },
    ],
  },
  {
    title: 'Graduate shadows',
    tokens: [1, 2, 3].map((n) => ({
      label: `graduate-shadow-${n}`,
      cssVar: `--arcis-color-graduate-shadow-${n}`,
    })),
  },
  {
    title: 'Graduate ecosystems',
    tokens: Array.from({ length: 17 }, (_, i) => ({
      label: `eco-${i + 1}`,
      cssVar: `--eco-${i + 1}`,
    })),
  },
  {
    title: 'Government',
    tokens: [
      { label: 'goverment-primary-main', cssVar: '--goverment-primary-main' },
      { label: 'goverment-primary-dark', cssVar: '--goverment-primary-dark' },
      { label: 'goverment-secondary-main', cssVar: '--goverment-secondary-main' },
      { label: 'goverment-secondary-dark', cssVar: '--goverment-secondary-dark' },
      { label: 'goverment-shadows-main', cssVar: '--goverment-shadows-main' },
      { label: 'goverment-shadows-dark', cssVar: '--goverment-shadows-dark' },
    ],
  },
  {
    title: 'Semantics',
    tokens: (['info', 'success', 'warning', 'error'] as const).flatMap((kind) =>
      (['light', 'main', 'dark'] as const).map((shade) => ({
        label: `${kind}-${shade}`,
        cssVar: `--${kind}-${shade}`,
      }))
    ),
  },
];

const resolved = ref<Record<string, string>>({});

onMounted(() => {
  const styles = getComputedStyle(document.documentElement);
  const values: Record<string, string> = {};
  for (const group of groups) {
    for (const token of group.tokens) {
      values[token.cssVar] = styles.getPropertyValue(token.cssVar).trim();
    }
  }
  resolved.value = values;
});
</script>

<template>
  <div class="fc">
    <div v-for="group in groups" :key="group.title" class="fc__group">
      <h4 class="fc__group-title">{{ group.title }}</h4>
      <div class="fc__grid">
        <div v-for="token in group.tokens" :key="token.cssVar" class="fc__swatch">
          <span class="fc__chip" :style="{ backgroundColor: `var(${token.cssVar})` }"></span>
          <span class="fc__label">{{ token.label }}</span>
          <span class="fc__hex">{{ resolved[token.cssVar] || '—' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  color: var(--docs-text-subtle);
}
.fc__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}
.fc__swatch {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.fc__chip {
  display: block;
  width: 100%;
  height: 48px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}
.fc__label {
  font-size: 11px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  color: var(--docs-text);
}
.fc__hex {
  font-size: 10px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  color: var(--docs-text-subtle);
  text-transform: uppercase;
}
</style>
