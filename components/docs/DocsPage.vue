<script setup lang="ts">
/**
 * DocsPage — página de Documentación del ARCIS Design System, para
 * desarrolladores: sidebar con navegación (Foundations / Elements) +
 * contenido principal con cada sección (vista previa en vivo + código
 * de ejemplo copiable), estilo Tailwind Docs.
 *
 * Es el único componente que un consumidor (front, o cualquier otra
 * app que use esta librería) necesita montar en una ruta propia — todo
 * lo demás (contenido, sub-componentes) vive acá en SharedBlocks-Unifed.
 *
 * Tema claro/oscuro: el color de fondo/texto/borde del CROMO de esta
 * página (sidebar, títulos, tarjetas de preview) se controla con
 * variables CSS (--docs-*) definidas acá en la raíz ".docs-page" y
 * redefinidas bajo ".docs-page[data-theme='dark']". Como son variables
 * CSS, heredan a través de los límites de <style scoped> hacia
 * DocsSection.vue y los visores de Foundations sin que cada uno tenga
 * que declarar su propio interruptor de tema — solo referencian
 * var(--docs-*). El color de los swatches/tokens en sí (ej. los chips
 * de FoundationsColors) NO usa estas variables a propósito: esos
 * representan un valor real de ARCIS y no deben cambiar con el tema de
 * la página. La preferencia se guarda en localStorage.
 */
import { ref, watch, onMounted } from 'vue';
import { FOUNDATIONS_REGISTRY } from './content/FoundationsRegistry';
import { ELEMENTS_REGISTRY } from '../pre_elements/ElementsRegistry';
import { ELEMENTS_DOCS } from './content/ElementsDocsContent';
import DocsSection from './DocsSection.vue';

const STORAGE_KEY = 'arcis-docs-theme';

const theme = ref<'light' | 'dark'>('light');

onMounted(() => {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    stored = null;
  }

  if (stored === 'light' || stored === 'dark') {
    theme.value = stored;
  } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    theme.value = 'dark';
  }
});

watch(theme, (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* localStorage no disponible (ej. modo privado) */
  }
});

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
</script>

<template>
  <div class="docs-page" :data-theme="theme">
    <aside class="docs-page__sidebar">
      <div class="docs-page__brand">
        <span class="docs-page__brand-mark">ARCIS</span>
        <span class="docs-page__brand-sub">Design System</span>
        <button
          type="button"
          class="docs-page__theme-toggle"
          :aria-label="theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'"
          @click="toggleTheme"
        >
          {{ theme === 'light' ? '🌙' : '☀️' }}
        </button>
      </div>

      <nav class="docs-page__nav">
        <div class="docs-page__nav-group">
          <span class="docs-page__nav-title">Foundations</span>
          <button
            v-for="(item, key) in FOUNDATIONS_REGISTRY"
            :key="`f-${key}`"
            type="button"
            class="docs-page__nav-link"
            @click="scrollTo(`foundation-${key}`)"
          >
            {{ item.label }}
          </button>
        </div>

        <div class="docs-page__nav-group">
          <span class="docs-page__nav-title">Elements</span>
          <button
            v-for="(item, key) in ELEMENTS_REGISTRY"
            :key="`e-${key}`"
            type="button"
            class="docs-page__nav-link"
            @click="scrollTo(`element-${key}`)"
          >
            {{ item.label }}
          </button>
        </div>
      </nav>
    </aside>

    <main class="docs-page__main">
      <header class="docs-page__header">
        <h1 class="docs-page__header-title">ARCIS Design System</h1>
        <p class="docs-page__header-text">
          Documentación de referencia para desarrolladores — Foundations y Elements de SharedBlocks-Unifed.
          Tokens: arcis-2, el export de variables de Figma (<code>assets/styles/ds/ds-tokens.css</code>).
        </p>
      </header>

      <section class="docs-page__block">
        <h2 class="docs-page__block-title">Foundations</h2>
        <DocsSection
          v-for="(item, key) in FOUNDATIONS_REGISTRY"
          :id="`foundation-${key}`"
          :key="`f-${key}`"
          :title="item.label"
          :description="item.description"
        >
          <template #preview>
            <component :is="item.component" />
          </template>
        </DocsSection>
      </section>

      <section class="docs-page__block">
        <h2 class="docs-page__block-title">Elements</h2>
        <DocsSection
          v-for="(item, key) in ELEMENTS_REGISTRY"
          :id="`element-${key}`"
          :key="`e-${key}`"
          :title="item.label"
          :description="ELEMENTS_DOCS[key]?.description"
          :code="ELEMENTS_DOCS[key]?.code"
        >
          <template #preview>
            <component :is="item.component" />
          </template>
        </DocsSection>
      </section>
    </main>
  </div>
</template>

<style scoped>
.docs-page {
  /* Tema claro (por defecto) */
  --docs-bg: #ffffff;
  --docs-bg-sidebar: #fcfcfc;
  --docs-bg-elevated: #fafafa;
  --docs-bg-hover: #f2f2f3;
  --docs-text: #16171a;
  --docs-text-muted: #5a5c62;
  --docs-text-subtle: #9a9ca1;
  --docs-text-faint: #b5b7bc;
  --docs-border: #ececec;
  --docs-accent: #e3173e;

  display: flex;
  min-height: 100vh;
  background: var(--docs-bg);
  color: var(--docs-text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: background-color 150ms ease, color 150ms ease;
}

.docs-page[data-theme='dark'] {
  --docs-bg: #131316;
  --docs-bg-sidebar: #18181b;
  --docs-bg-elevated: #1c1c20;
  --docs-bg-hover: #232327;
  --docs-text: #f2f2f3;
  --docs-text-muted: #b5b7bc;
  --docs-text-subtle: #82848a;
  --docs-text-faint: #5a5c62;
  --docs-border: #2a2a2e;
  --docs-accent: #ff5470;
}

.docs-page__sidebar {
  flex-shrink: 0;
  width: 240px;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
  padding: 20px 16px;
  border-right: 1px solid var(--docs-border);
  background: var(--docs-bg-sidebar);
}
.docs-page__brand {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px 20px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--docs-border);
}
.docs-page__brand-mark {
  font-size: 16px;
  font-weight: 700;
  color: var(--docs-accent);
}
.docs-page__brand-sub {
  flex: 1;
  font-size: 11px;
  color: var(--docs-text-subtle);
}
.docs-page__theme-toggle {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--docs-border);
  border-radius: 6px;
  background: var(--docs-bg);
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
  transition: border-color 120ms ease;
}
.docs-page__theme-toggle:hover {
  border-color: var(--docs-accent);
}
.docs-page__nav {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.docs-page__nav-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.docs-page__nav-title {
  padding: 0 8px;
  margin-bottom: 6px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--docs-text-faint);
}
.docs-page__nav-link {
  display: block;
  width: 100%;
  text-align: left;
  padding: 6px 8px;
  border: none;
  background: none;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  color: var(--docs-text-muted);
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease;
}
.docs-page__nav-link:hover {
  background: var(--docs-bg-hover);
  color: var(--docs-text);
}

.docs-page__main {
  flex: 1;
  min-width: 0;
  padding: 48px 56px 120px;
}
.docs-page__header {
  padding-bottom: 32px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--docs-border);
}
.docs-page__header-title {
  margin: 0 0 8px;
  font-size: 34px;
  font-weight: 700;
  color: var(--docs-text);
}
.docs-page__header-text {
  margin: 0;
  max-width: 640px;
  font-size: 15px;
  line-height: 1.6;
  color: var(--docs-text-muted);
}
.docs-page__header-text code {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 13px;
  background: var(--docs-bg-hover);
  padding: 1px 5px;
  border-radius: 4px;
}
.docs-page__block {
  padding-top: 24px;
}
.docs-page__block-title {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--docs-accent);
}
</style>
