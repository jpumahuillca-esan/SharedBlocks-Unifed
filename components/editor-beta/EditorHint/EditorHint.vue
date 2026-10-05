<template>
  <p class="editor-hint" :class="{ 'is-after': after, 'is-warn': tone === 'warn' }">
    <slot />
  </p>
</template>

<script setup lang="ts">
/**
 * Texto de ayuda de un campo. Era el párrafo `*-hint` que cada editor declaraba
 * con su propia hoja: mismo tamaño, mismo gris, mismo margen.
 */
withDefaults(
  defineProps<{
    /** `warn` lo pinta en rojo: avisa de algo que el editor puede corregir. */
    tone?: 'default' | 'warn';
    /** Va DESPUÉS de lo que explica: poco margen arriba y ninguno abajo. */
    after?: boolean;
  }>(),
  { tone: 'default' },
);
</script>

<style scoped>
.editor-hint {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #6b7688;
}

.editor-hint.is-after {
  margin: 4px 0 0;
}

.editor-hint.is-warn {
  color: #b02a37;
}
</style>
