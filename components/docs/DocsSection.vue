<script setup lang="ts">
/**
 * DocsSection — bloque reutilizable de la página de Documentación:
 * título, descripción, vista previa en vivo (slot) y bloque de código
 * debajo con botón de copiar. La misma pieza sirve tanto para
 * Foundations como para Elements — lo único que cambia es qué se pasa
 * en el slot #preview y en la prop `code`.
 *
 * El recuadro de preview lleva la clase "arcis-scope" — es lo único de
 * esta página que necesita el reset/CSS de componentes de ARCIS (los
 * Elements viven ahí adentro); el resto del cromo de la página de docs
 * (sidebar, títulos, bloque de código) queda deliberadamente afuera de
 * ese scope, para no heredar nada del reset de ARCIS.
 *
 * El fondo del recuadro de preview queda SIEMPRE claro, sin importar el
 * tema (claro/oscuro) de la página de docs: los Elements de ARCIS no
 * son theme-aware (dan por hecho fondo claro — texto negro fijo, cards
 * en blanco, etc.), así que oscurecer ese recuadro los volvería
 * ilegibles. Solo el cromo alrededor (título, descripción, borde) sigue
 * las variables --docs-* definidas en DocsPage.vue.
 */
import CodeBlock from './CodeBlock.vue';

withDefaults(defineProps<{
  id: string;
  title: string;
  description?: string;
  /** Si no se pasa, no se muestra el bloque de código (ej. Foundations). */
  code?: string;
}>(), {});
</script>

<template>
  <section :id="id" class="docs-section">
    <h2 class="docs-section__title">{{ title }}</h2>
    <p v-if="description" class="docs-section__description">{{ description }}</p>

    <div class="docs-section__preview arcis-scope">
      <slot name="preview" />
    </div>

    <CodeBlock v-if="code" :code="code" />
  </section>
</template>

<style scoped>
.docs-section {
  padding: 48px 0;
  border-bottom: 1px solid var(--docs-border);
}
.docs-section:last-child {
  border-bottom: none;
}
.docs-section__title {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
  color: var(--docs-text);
}
.docs-section__description {
  margin: 0 0 20px;
  max-width: 640px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--docs-text-muted);
}
.docs-section__preview {
  /* borde/fondo fijos a propósito, no siguen --docs-* — ver nota arriba
     sobre por qué el recuadro de preview queda siempre claro */
  margin-bottom: 16px;
  padding: 32px;
  border-radius: 10px;
  border: 1px solid #ececec;
  background: #fafafa;
}
</style>
