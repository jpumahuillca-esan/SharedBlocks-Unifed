<template>
  <div class="course-detail-layout">
    <PageSections v-if="hasBlocks" :content="blocks || []" />
  </div>
</template>

<script setup lang="ts">
/**
 * Layout público unificado de Detalle de Curso / Taller / Certificación / Idioma / Titulación.
 *
 * - Si el curso ya tiene secciones diseñadas en el CMS (`blocks.length > 0`), renderiza
 *   directamente esas secciones sin duplicar la antigua ficha Bootstrap encima.
 * - Si aún no tiene secciones guardadas (`blocks.length === 0`), permanece completamente en blanco
 *   para que el editor pueda aplicar manualmente una plantilla desde `courses-editor/:id`.
 */
import { computed } from 'vue';
import PageSections from '../../layout/PageSections.vue';

const props = defineProps<{
  course: Record<string, any>;
  blocks?: any[];
}>();

const hasBlocks = computed(() => Array.isArray(props.blocks) && props.blocks.length > 0);
</script>
