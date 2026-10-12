<script setup lang="ts">
/**
 * CodeBlock — bloque de código con botón de copiar, para la página de
 * Documentación (components/docs/). Texto plano con tipografía
 * monoespaciada, sin resaltado de sintaxis por librería externa (no hay
 * ninguna instalada en el proyecto y no vale la pena sumar una
 * dependencia solo para esto) — prioriza legibilidad simple y
 * confiable sobre resaltado "bonito".
 *
 * A propósito NO sigue el tema claro/oscuro de DocsPage.vue (--docs-*):
 * queda siempre oscuro, como en la mayoría de sitios de documentación
 * (Tailwind, shadcn), para que el código resalte igual sobre cualquier
 * fondo de página.
 */
import { computed, ref } from 'vue';

const props = withDefaults(defineProps<{
  code: string;
  lang?: string;
  /** Línea opcional que se destaca para enlazar un campo con su uso. */
  highlightLine?: number;
}>(), {
  lang: 'vue-html',
});

const copied = ref(false);
const lines = computed(() => props.code.split(/\r?\n/));

const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1800);
  } catch {
    /* clipboard no disponible (ej. contexto no seguro) */
  }
};
</script>

<template>
  <div class="docs-code-block" :class="{ 'has-highlight': props.highlightLine !== undefined }">
    <div class="docs-code-block__bar">
      <span class="docs-code-block__lang">{{ lang }}</span>
      <button type="button" class="docs-code-block__copy" @click="copy">
        {{ copied ? 'Copiado' : 'Copiar' }}
      </button>
    </div>
    <pre class="docs-code-block__pre"><code v-if="props.highlightLine === undefined">{{ code }}</code><code v-else><span v-for="(line, index) in lines" :key="index" class="docs-code-block__line" :class="{ 'is-highlighted': props.highlightLine === index + 1 }" :data-line="index + 1">{{ line || ' ' }}</span></code></pre>
  </div>
</template>

<style scoped>
.docs-code-block {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #2a2a2a;
  background: #16171a;
}
.docs-code-block__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: #1f2023;
  border-bottom: 1px solid #2a2a2a;
}
.docs-code-block__lang {
  font-size: 11px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  color: #8a8d93;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.docs-code-block__copy {
  font-size: 12px;
  font-family: inherit;
  color: #d5d7db;
  background: transparent;
  border: 1px solid #3a3b3f;
  border-radius: 6px;
  padding: 3px 10px;
  cursor: pointer;
  transition: border-color 150ms ease, color 150ms ease;
}
.docs-code-block__copy:hover {
  border-color: #e3173e;
  color: #ffffff;
}
.docs-code-block__pre {
  margin: 0;
  padding: 14px 16px;
  overflow-x: auto;
}
.docs-code-block__pre code {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #e4e5e7;
  white-space: pre;
}
.docs-code-block__line {
  display: block;
  min-height: 1.6em;
  padding: 0 10px;
  margin: 0 -10px;
}
.docs-code-block.has-highlight .docs-code-block__pre code {
  display: block;
  width: max-content;
  min-width: 100%;
}
.docs-code-block.has-highlight .docs-code-block__line::before {
  display: inline-block;
  width: 24px;
  margin-right: 12px;
  color: #747981;
  text-align: right;
  content: attr(data-line);
  user-select: none;
}
.docs-code-block__line.is-highlighted {
  border-left: 3px solid #e3173e;
  background: rgba(227, 23, 62, 0.16);
  color: #ffffff;
}
</style>
