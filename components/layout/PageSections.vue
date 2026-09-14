<template>
  <div class="page-sections">
    <section
      v-for="section in sections"
      :key="section.id"
      class="page-section"
      :style="sectionStyle(section)"
    >
      <div class="page-section__columns" :style="columnsStyle(section)">
        <div
          v-for="column in section.columns"
          :key="column.id"
          class="page-section__column"
          :style="columnStyle(column, section)"
        >
          <template v-for="block in column.blocks" :key="block.id">
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
  resolveSectionStyle,
  resolveColumnsStyle,
  resolveColumnStyle,
} from '../../core/sectionStyles';
import type { SectionColumn, SectionItem } from '../../core/sectionTypes';

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
const columnsStyle = (section: SectionItem) => resolveColumnsStyle(section.settings);
// Se pasa la columna completa: puede traer anclaje propio al hacer scroll.
const columnStyle = (column: SectionColumn, section: SectionItem) =>
  resolveColumnStyle(column, section.settings);
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
