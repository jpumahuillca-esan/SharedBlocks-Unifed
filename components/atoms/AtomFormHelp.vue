<script setup lang="ts">
/**
 * AtomFormHelp — átomo de texto de ayuda bajo un campo (ARCIS Design
 * System, Elementos > Formularios > Campos).
 *
 * Envuelve ".form-help" portada en assets/styles/elements/_forms.scss.
 * No colisiona con Bootstrap (Bootstrap usa ".form-text"), no necesita
 * marcador extra. El color rojo de error no se controla acá: lo aplica
 * automáticamente ".form-group.has-error .form-help" cuando este átomo
 * vive dentro de un MoleculeFormField con error.
 */
</script>

<template>
  <span class="form-help">
    <slot />
  </span>
</template>
