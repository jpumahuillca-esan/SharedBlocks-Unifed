<template>
  <!--
    `arcis-scope` activa el sistema de diseño: todas sus reglas están anidadas
    bajo esa clase, así que sin ella los bloques salen sin estilos.
  -->
  <div class="page-sections arcis-scope">
    <section
      v-for="section in sections"
      :key="section.id"
      class="page-section"
      :style="sectionStyle(section)"
    >
      <div
        class="page-section__columns"
        :class="columnsClass(section)"
        :style="columnsStyle(section)"
      >
        <div
          v-for="(column, columnIndex) in section.columns"
          :key="column.id"
          class="page-section__column"
          :class="columnClass(column, section)"
          :style="columnStyles(section)[columnIndex]"
        >
          <template v-for="block in column.blocks" :key="block.id">
            <!--
              En una sección con columna flotante cada bloque va en su propio
              envoltorio con `order`: en móvil las columnas desaparecen y es lo
              que coloca el formulario debajo del bloque elegido.
            -->
            <div
              v-if="isFloating(section)"
              class="page-section__block"
              :style="{ order: blockOrders(section)[block.id] }"
            >
              <component
                v-if="resolveBlock(block.type)"
                :is="resolveBlock(block.type)"
                :id="'sec-' + block.id"
                :data="block.content"
              />

              <div v-else-if="showUnknown" class="page-section__unknown">
                Bloque no registrado: <strong>{{ block.type }}</strong>
              </div>
            </div>

            <template v-else>
              <component
                v-if="resolveBlock(block.type)"
                :is="resolveBlock(block.type)"
                :id="'sec-' + block.id"
                :data="block.content"
              />

              <!-- Un bloque sin registrar no debe tumbar la página -->
              <div v-else-if="showUnknown" class="page-section__unknown">
                Bloque no registrado: <strong>{{ block.type }}</strong>
              </div>
            </template>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { resolveBlock } from '../../core/BlockRegistry';
import { normalizeToSections } from '../../core/sectionNormalize';
import {
  hasFloatingColumn,
  resolveBlockOrders,
  resolveColumnClass,
  resolveColumnStyles,
  resolveColumnsClass,
  resolveColumnsStyle,
  resolveSectionStyle,
} from '../../core/sectionStyles';
import type { SectionColumn, SectionItem } from '../../core/sectionTypes';
// Disposición de las secciones con columna flotante (escritorio / móvil).
import '../../assets/styles/section-layout.scss';

const props = withDefaults(
  defineProps<{
    /**
     * Contenido tal cual llega del backend. Admite el formato de secciones y
     * el heredado de bloques planos: la normalización decide cuál es.
     */
    content: unknown;
    /** Mostrar un aviso cuando un bloque no existe en el registro. */
    showUnknown?: boolean;
  }>(),
  { showUnknown: false },
);

const sections = computed<SectionItem[]>(() => normalizeToSections(props.content));

const sectionStyle = (section: SectionItem) => resolveSectionStyle(section.settings, 'live');
const columnsStyle = (section: SectionItem) => resolveColumnsStyle(section.settings, section.columns);
const columnsClass = (section: SectionItem) => resolveColumnsClass(section.settings, section.columns);

/*
 * Se resuelven todas las columnas a la vez: con una columna flotante, la
 * posición de cada normal depende de las que tiene delante. Se guardan por
 * sección para no recalcular en cada columna.
 */
const columnStylesBySection = computed(() =>
  Object.fromEntries(
    sections.value.map((section) => [section.id, resolveColumnStyles(section.columns, section.settings)]),
  ),
);
const columnStyles = (section: SectionItem) => columnStylesBySection.value[section.id] ?? [];

const isFloating = (section: SectionItem) => hasFloatingColumn(section.columns);
const columnClass = (column: SectionColumn, section: SectionItem) =>
  resolveColumnClass(column, isFloating(section));

// Orden de los bloques cuando la sección se apila en móvil.
const blockOrdersBySection = computed(() =>
  Object.fromEntries(sections.value.map((section) => [section.id, resolveBlockOrders(section.columns)])),
);
const blockOrders = (section: SectionItem) => blockOrdersBySection.value[section.id] ?? {};
</script>

<style scoped>
.page-sections {
  width: 100%;
}

.page-section {
  position: relative;
}

.page-section__column {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.page-section__block {
  min-width: 0;
}

.page-section__unknown {
  padding: 14px;
  border: 1px dashed #ffc107;
  border-radius: 6px;
  background: #fff8e1;
  color: #8a6d00;
  font-size: 13px;
  text-align: center;
}
</style>
